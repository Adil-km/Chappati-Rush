import shapeDefinitions from '../data/shapeDefinitions.json';

export const SHAPES = {
  CIRCLE: 'CIRCLE',
  OVAL: 'OVAL',
  SQUARE: 'SQUARE',
  TRIANGLE: 'TRIANGLE',
  HEART: 'HEART',
  STAR: 'STAR',
  ROYAL_STAR: 'ROYAL_STAR',
  CROWN: 'CROWN'
};

/**
 * Generates an array of 64 sample points (x, y) along the target shape contour relative to (cx, cy)
 * driven directly by shapeDefinitions.json.
 */
export function getTargetShapePoints(shapeType, cx = 300, cy = 300, numPoints = 64) {
  const points = [];
  const config = shapeDefinitions[shapeType] || shapeDefinitions.CIRCLE;

  switch (config.type) {
    case 'oval': {
      const rx = config.radiusX || 120;
      const ry = config.radiusY || 70;
      for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2;
        points.push({
          x: cx + rx * Math.cos(angle),
          y: cy + ry * Math.sin(angle)
        });
      }
      break;
    }

    case 'square': {
      const half = config.halfWidth || 80;
      for (let i = 0; i < numPoints; i++) {
        const t = (i / numPoints) * 4;
        let x, y;
        if (t < 1) {
          x = cx - half + t * (2 * half);
          y = cy - half;
        } else if (t < 2) {
          x = cx + half;
          y = cy - half + (t - 1) * (2 * half);
        } else if (t < 3) {
          x = cx + half - (t - 2) * (2 * half);
          y = cy + half;
        } else {
          x = cx - half;
          y = cy + half - (t - 3) * (2 * half);
        }
        points.push({ x, y });
      }
      break;
    }

    case 'triangle': {
      const r = config.radius || 100;
      const vertices = [
        { x: cx, y: cy - r },
        { x: cx + r * Math.cos(Math.PI / 6), y: cy + r * Math.sin(Math.PI / 6) },
        { x: cx - r * Math.cos(Math.PI / 6), y: cy + r * Math.sin(Math.PI / 6) }
      ];
      for (let i = 0; i < numPoints; i++) {
        const t = (i / numPoints) * 3;
        const sideIndex = Math.floor(t);
        const frac = t - sideIndex;
        const v1 = vertices[sideIndex % 3];
        const v2 = vertices[(sideIndex + 1) % 3];
        points.push({
          x: v1.x + frac * (v2.x - v1.x),
          y: v1.y + frac * (v2.y - v1.y)
        });
      }
      break;
    }

    case 'heart': {
      const scale = config.scale || 6.2;
      for (let i = 0; i < numPoints; i++) {
        const t = (i / numPoints) * Math.PI * 2;
        const x = cx + scale * (16 * Math.pow(Math.sin(t), 3));
        const y = cy - scale * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        points.push({ x, y });
      }
      break;
    }



    case 'star': {
      const outerR = config.outerRadius || 95;
      const innerR = config.innerRadius || 42;
      const starPoints = config.numPoints || 5;
      const totalVertices = starPoints * 2;

      const vertices = [];
      for (let k = 0; k < totalVertices; k++) {
        const angle = (k / totalVertices) * Math.PI * 2 - Math.PI / 2;
        const r = k % 2 === 0 ? outerR : innerR;
        vertices.push({
          x: cx + r * Math.cos(angle),
          y: cy + r * Math.sin(angle)
        });
      }

      for (let i = 0; i < numPoints; i++) {
        const t = (i / numPoints) * totalVertices;
        const segIndex = Math.floor(t);
        const frac = t - segIndex;
        const v1 = vertices[segIndex % totalVertices];
        const v2 = vertices[(segIndex + 1) % totalVertices];
        points.push({
          x: v1.x + frac * (v2.x - v1.x),
          y: v1.y + frac * (v2.y - v1.y)
        });
      }
      break;
    }

    case 'crown': {
      // 5-peak majestic crown polygon contour
      const crownVertices = [
        { x: 0, y: -95 },     // Top center peak
        { x: 22, y: +10 },    // Dip right of center
        { x: 50, y: -75 },    // Mid-right peak
        { x: 58, y: +15 },    // Dip outer right
        { x: 92, y: -55 },    // Outer right peak
        { x: 95, y: -15 },    // Outer right shoulder
        { x: 80, y: +55 },    // Bottom right corner
        { x: -80, y: +55 },   // Bottom left corner
        { x: -95, y: -15 },   // Outer left shoulder
        { x: -92, y: -55 },   // Outer left peak
        { x: -58, y: +15 },   // Dip outer left
        { x: -50, y: -75 },   // Mid-left peak
        { x: -22, y: +10 }    // Dip left of center
      ];

      const numSegs = crownVertices.length;
      for (let i = 0; i < numPoints; i++) {
        const t = (i / numPoints) * numSegs;
        const segIndex = Math.floor(t);
        const frac = t - segIndex;
        const v1 = crownVertices[segIndex % numSegs];
        const v2 = crownVertices[(segIndex + 1) % numSegs];
        points.push({
          x: cx + v1.x + frac * (v2.x - v1.x),
          y: cy + v1.y + frac * (v2.y - v1.y)
        });
      }
      break;
    }

    case 'circle':
    default: {
      const radius = config.radius || 90;
      for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2;
        points.push({
          x: cx + radius * Math.cos(angle),
          y: cy + radius * Math.sin(angle)
        });
      }
      break;
    }
  }

  return points;
}

/**
 * Draws golden dashed target shape on HTML5 Canvas.
 */
export function drawTargetShapeOutline(ctx, shapeType, cx = 300, cy = 300, titleLabel = '') {
  const points = getTargetShapePoints(shapeType, cx, cy, 128);
  if (!points || points.length === 0) return;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.closePath();

  ctx.setLineDash([8, 6]);
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.85)';
  ctx.lineWidth = 3.5;
  ctx.stroke();

  ctx.setLineDash([]);
  ctx.fillStyle = 'rgba(251, 191, 36, 0.9)';
  ctx.font = '600 13px Fredoka, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`TARGET: ${titleLabel.toUpperCase()}`, cx, cy - 110);
  ctx.restore();
}
