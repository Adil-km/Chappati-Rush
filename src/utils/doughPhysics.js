export const NUM_VERTICES = 64;
export const TARGET_DIAMETER = 180; // pixels
export const TARGET_RADIUS = TARGET_DIAMETER / 2; // 90px
export const INITIAL_RADIUS = 42; // pixels

/**
 * Creates the initial circular dough ball mesh state.
 */
export function createInitialDough(centerX, centerY) {
  const radii = new Float32Array(NUM_VERTICES);
  // Add subtle natural organic variation (±2px noise) to initial dough
  for (let i = 0; i < NUM_VERTICES; i++) {
    radii[i] = INITIAL_RADIUS + (Math.random() * 3 - 1.5);
  }

  return {
    centerX,
    centerY,
    radii,
    numVertices: NUM_VERTICES,
    smoothingIterations: 0
  };
}

/**
 * Deforms the dough mesh based on a rolling pin stroke vector from (p1x, p1y) to (p2x, p2y).
 */
export function applyRollingPinStroke(dough, p1x, p1y, p2x, p2y, pinWidth = 140) {
  const { centerX, centerY, radii } = dough;
  
  const vx = p2x - p1x;
  const vy = p2y - p1y;
  const strokeLength = Math.hypot(vx, vy);

  if (strokeLength < 2) return dough; // Negligible movement

  // Roll direction vector (normalized)
  const dirX = vx / strokeLength;
  const dirY = vy / strokeLength;

  // Perpendicular vector for roller spread
  const perpX = -dirY;
  const perpY = dirX;

  // Midpoint of current stroke
  const midX = (p1x + p2x) / 2;
  const midY = (p1y + p2y) / 2;

  // Deformation intensity factor based on stroke velocity
  const force = Math.min(strokeLength * 0.25, 8.0);

  let updated = false;

  for (let i = 0; i < NUM_VERTICES; i++) {
    const angle = (i / NUM_VERTICES) * Math.PI * 2;
    const vxPos = centerX + radii[i] * Math.cos(angle);
    const vyPos = centerY + radii[i] * Math.sin(angle);

    // Vector from stroke center to vertex
    const dx = vxPos - midX;
    const dy = vyPos - midY;

    // Distance along stroke direction and perpendicular direction
    const projAlong = dx * dirX + dy * dirY;
    const projPerp = Math.abs(dx * perpX + dy * perpY);

    // Check if vertex is within roller width contact zone
    if (Math.abs(projAlong) < strokeLength * 1.5 && projPerp < pinWidth / 2) {
      // Vertex radial direction unit vector (from dough center to vertex)
      const vertexDirX = Math.cos(angle);
      const vertexDirY = Math.sin(angle);
      const alignment = vertexDirX * dirX + vertexDirY * dirY;
      const proximityFactor = 1 - projPerp / (pinWidth / 2);

      if (alignment > 0.1) {
        // Outward Roll: Flatten & Expand dough outwards
        const pushFactor = alignment * force * 0.85 * proximityFactor;
        radii[i] += pushFactor;
        updated = true;
      } else if (alignment < -0.15) {
        // Inward Roll: Squeeze & Shrink dough inwards towards center (Gentler magnitude & sharply focused)
        const squeezeFactor = Math.abs(alignment) * force * 0.32 * Math.pow(proximityFactor, 2.2);
        radii[i] = Math.max(25, radii[i] - squeezeFactor);
        updated = true;
      }
    }
  }

  // Smooth dough boundary if updated while preserving sharp localized contours
  if (updated) {
    smoothDoughRadii(radii);
  }

  return { ...dough, radii };
}

/**
 * Applies a gentle low-pass smoothing filter across adjacent radial vertices.
 */
export function smoothDoughRadii(radii) {
  const n = radii.length;
  const temp = new Float32Array(n);

  // Single-pass 3-tap weighted filter preserving sharp localized indentations (like hearts & stars)
  for (let i = 0; i < n; i++) {
    const prev = radii[(i - 1 + n) % n];
    const curr = radii[i];
    const next = radii[(i + 1) % n];
    temp[i] = prev * 0.18 + curr * 0.64 + next * 0.18;
  }

  for (let i = 0; i < n; i++) {
    radii[i] = temp[i];
  }
}

/**
 * Calculates geometric properties of the current dough shape.
 */
export function analyzeDoughShape(dough) {
  const { centerX, centerY, radii, numVertices } = dough;

  let area = 0;
  let perimeter = 0;
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;

  const points = [];

  for (let i = 0; i < numVertices; i++) {
    const angle = (i / numVertices) * Math.PI * 2;
    const r = radii[i];
    const x = centerX + r * Math.cos(angle);
    const y = centerY + r * Math.sin(angle);
    points.push({ x, y, r, angle });

    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }

  // Polygon area & perimeter
  for (let i = 0; i < numVertices; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % numVertices];

    // Shoelace formula term
    area += (p1.x * p2.y - p2.x * p1.y);

    // Euclidean distance for segment length
    perimeter += Math.hypot(p2.x - p1.x, p2.y - p1.y);
  }
  area = Math.abs(area / 2);

  const width = maxX - minX;
  const height = maxY - minY;
  const avgDiameter = (width + height) / 2;

  // Circularity index: 4 * pi * Area / Perimeter^2 (1.0 = perfect circle)
  const circularity = (4 * Math.PI * area) / (perimeter * perimeter);

  // Smoothness: calculate mean variance between neighbor radii
  let diffSum = 0;
  for (let i = 0; i < numVertices; i++) {
    const r1 = radii[i];
    const r2 = radii[(i + 1) % numVertices];
    diffSum += Math.pow(r1 - r2, 2);
  }
  const variance = Math.sqrt(diffSum / numVertices);

  // Estimated thickness (simulated inverse of area expansion)
  const initialArea = Math.PI * Math.pow(INITIAL_RADIUS, 2);
  const targetArea = Math.PI * Math.pow(TARGET_RADIUS, 2);
  const thicknessRatio = Math.min(area / targetArea, 1.3);

  return {
    area,
    perimeter,
    width,
    height,
    avgDiameter,
    circularity: Math.min(circularity, 1.0),
    variance,
    thicknessRatio,
    points
  };
}
