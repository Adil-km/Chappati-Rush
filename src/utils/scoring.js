import { analyzeDoughShape } from './doughPhysics';
import { getTargetShapePoints, SHAPES } from './shapeTargets';

/**
 * Calculates complete score breakdown out of 100 supporting non-circular target shapes.
 */
export function calculateGameScore(dough, completionTimeSeconds, targetShapeType = SHAPES.CIRCLE) {
  const metrics = analyzeDoughShape(dough);
  const { radii, numVertices, centerX, centerY } = dough;

  let shapeScore = 0;

  if (targetShapeType === SHAPES.CIRCLE) {
    // 1. Circle Shape Accuracy (40 Points Max)
    shapeScore = Math.max(0, Math.min(40, Math.round(metrics.circularity * 40)));
  } else {
    // Contour similarity for non-circular target shapes
    const targetPoints = getTargetShapePoints(targetShapeType, centerX, centerY, numVertices);
    let totalErrorRatio = 0;

    for (let i = 0; i < numVertices; i++) {
      const angle = (i / numVertices) * Math.PI * 2;
      const playerDist = radii[i];
      
      const tp = targetPoints[i];
      const targetDist = Math.hypot(tp.x - centerX, tp.y - centerY);

      const diff = Math.abs(playerDist - targetDist);
      totalErrorRatio += Math.min(1.0, diff / Math.max(1, targetDist));
    }

    const avgErrorRatio = totalErrorRatio / numVertices;
    const similarity = Math.max(0, 1 - avgErrorRatio * 1.5);
    shapeScore = Math.max(0, Math.min(40, Math.round(similarity * 40)));
  }

  // 2. Size Accuracy (20 Points Max)
  const targetPoints = getTargetShapePoints(targetShapeType, centerX, centerY, numVertices);
  let targetAvgRadius = 0;
  targetPoints.forEach(p => {
    targetAvgRadius += Math.hypot(p.x - centerX, p.y - centerY);
  });
  targetAvgRadius /= numVertices;
  const targetDiameter = targetAvgRadius * 2;

  const diameterDiff = Math.abs(metrics.avgDiameter - targetDiameter);
  const sizeRatio = Math.max(0, 1 - (diameterDiff / (targetDiameter * 0.5)));
  let sizeScore = Math.max(0, Math.min(20, Math.round(sizeRatio * 20)));

  // 3. Smoothness Score (15 Points Max)
  const smoothFactor = Math.max(0, 1 - (metrics.variance / 4.0));
  let smoothnessScore = Math.max(0, Math.min(15, Math.round(smoothFactor * 15)));

  // 4. Thickness Score (15 Points Max)
  const targetArea = Math.PI * Math.pow(targetAvgRadius, 2);
  const areaRatio = metrics.area / targetArea;
  let thicknessFactor = 1.0;
  if (areaRatio < 0.65) {
    thicknessFactor = areaRatio / 0.65;
  } else if (areaRatio > 1.35) {
    thicknessFactor = Math.max(0, 1 - (areaRatio - 1.35));
  }
  let thicknessScore = Math.max(0, Math.min(15, Math.round(thicknessFactor * 15)));

  // 5. Speed Bonus (10 Points Max)
  let speedScore = 2;
  if (completionTimeSeconds < 10) {
    speedScore = 10;
  } else if (completionTimeSeconds < 15) {
    speedScore = 8;
  } else if (completionTimeSeconds < 20) {
    speedScore = 6;
  } else if (completionTimeSeconds < 25) {
    speedScore = 4;
  } else {
    speedScore = 2;
  }

  const totalScore = Math.min(100, shapeScore + sizeScore + smoothnessScore + thicknessScore + speedScore);

  // Performance Rating mapping (FRD Section 15)
  let rating = { title: 'Disaster Roti', emoji: '💀', color: '#ef4444' };
  if (totalScore >= 95) {
    rating = { title: 'Roti Master', emoji: '👑', color: '#fbbf24' };
  } else if (totalScore >= 90) {
    rating = { title: 'Excellent', emoji: '⭐', color: '#10b981' };
  } else if (totalScore >= 80) {
    rating = { title: 'Great', emoji: '🔥', color: '#f97316' };
  } else if (totalScore >= 70) {
    rating = { title: 'Good', emoji: '👍', color: '#60a5fa' };
  } else if (totalScore >= 50) {
    rating = { title: 'Needs Practice', emoji: '😐', color: '#a855f7' };
  }

  return {
    totalScore,
    shapeScore,
    sizeScore,
    smoothnessScore,
    thicknessScore,
    speedScore,
    completionTimeSeconds: Math.round(completionTimeSeconds * 10) / 10,
    rating,
    metrics
  };
}
