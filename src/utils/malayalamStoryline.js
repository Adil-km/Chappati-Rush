import storylineData from '../data/storylineData.json';
import { SHAPES } from './shapeTargets';

export const STORY_STAGES = storylineData.stages;

export function getLevelById(levelId) {
  for (const stage of STORY_STAGES) {
    const found = stage.levels.find(l => l.id === levelId);
    if (found) return found;
  }
  return STORY_STAGES[0].levels[0];
}

export function calculateLevelStars(score) {
  if (score >= 90) return 3;
  if (score >= 78) return 2;
  if (score >= 60) return 1;
  return 0;
}
