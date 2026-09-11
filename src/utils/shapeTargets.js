/**
 * Parametric boundary formulas and canvas rendering for 7 target shapes.
 */

export const SHAPES = {
  CIRCLE: 'CIRCLE',
  OVAL: 'OVAL',
  SQUARE: 'SQUARE',
  TRIANGLE: 'TRIANGLE',
  HEART: 'HEART',
  CRESCENT: 'CRESCENT',
  STAR: 'STAR'
};

/**
 * Returns an array of 64 sample points (x, y) along the target shape contour relative to (cx, cy).
 */
export function getTargetShapePoints(shapeType, cx = 300, cy = 300, numPoints = 64) {
  const points = [];

  switch (shapeType) {
    case SHAPES.OVAL: {
      const rx = 120;
      const ry = 70;
      for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2;
        points.push({
          x: cx + rx * Math.cos(angle),
          y: cy + ry * Math.sin(angle)
        });
      }
      break;
    }

    case SHAPES.SQUARE: {
      const half = 80;
      // 4 sides around (cx, cy)
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

    case SHAPES.TRIANGLE: {
      const r = 100;
      // 3 vertices of equilateral triangle
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

    case SHAPES.HEART: {
      for (let i = 0; i < numPoints; i++) {
        const t = (i / numPoints) * Math.PI * 2;
        const x = cx + 6.2 * (16 * Math.pow(Math.sin(t), 3));
        const y = cy - 6.2 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        points.push({ x, y });
      }
      break;
    }

    case SHAPES.CRESCENT: {
      const half = Math.floor(numPoints / 2);
      const span = Math.PI * 0.72; // Arc angle span

      // Outer Arc Tip coordinates
      const topTipX = -12 + 95 * Math.cos(-span);
      const topTipY = 95 * Math.sin(-span);
      const botTipX = -12 + 95 * Math.cos(span);
      const botTipY = 95 * Math.sin(span);

      // Outer Arc: From top tip to bottom tip
      for (let i = 0; i < half; i++) {
        const frac = i / (half - 1);
        const angle = -span + frac * (2 * span);
        points.push({
          x: cx - 12 + 95 * Math.cos(angle),
          y: cy + 95 * Math.sin(angle)
        });
      }

      // Inner Arc: From bottom tip back to top tip (tapered to meet tips seamlessly)
      for (let i = 0; i < numPoints - half; i++) {
        const frac = i / (numPoints - half - 1);
        const angle = span - frac * (2 * span);
        const taper = Math.sin(frac * Math.PI); // 0 at tips, 1 at center cutout

        const innerX = 18 + 72 * Math.cos(angle);
        const innerY = 72 * Math.sin(angle);

        const targetTipX = (frac < 0.5) ? botTipX : topTipX;
        const targetTipY = (frac < 0.5) ? botTipY : topTipY;

        points.push({
          x: cx + (innerX * taper + targetTipX * (1 - taper)),
          y: cy + (innerY * taper + targetTipY * (1 - taper))
        });
      }
      break;
    }

    case SHAPES.STAR: {
      const outerR = 95;
      const innerR = 42;
      for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2 - Math.PI / 2;
        // 5 points => 10 segments
        const step = Math.floor((i / numPoints) * 10);
        const radius = step % 2 === 0 ? outerR : innerR;
        points.push({
          x: cx + radius * Math.cos(angle),
          y: cy + radius * Math.sin(angle)
        });
      }
      break;
    }

    case SHAPES.CIRCLE:
    default: {
      const radius = 90;
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
