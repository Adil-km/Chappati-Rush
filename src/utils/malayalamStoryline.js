import { SHAPES } from './shapeTargets';

export const STORY_STAGES = [
  {
    id: 'stage_1',
    title: 'Stage 1: Village Street Stall 🟢',
    subtitle: 'Learn the basics from Dasan Ashaan',
    levels: [
      {
        id: 'level_1',
        levelNumber: 1,
        title: 'Classic Phulka',
        shapeType: SHAPES.CIRCLE,
        timeLimit: 30,
        passingScore: 60,
        character: {
          name: 'Dasan Ashaan',
          movie: 'Nadodikkattu',
          avatar: '/characters/dasan_ashaan.jpg',
          dialogue: 'Hello Mr. Perera! Pavanayi Shavamayi, but your roti shouldn\'t be shavamayi! Roll me a classic round Phulka fast!',
          tagline: 'Master Chef Mentor'
        }
      },
      {
        id: 'level_2',
        levelNumber: 2,
        title: 'Soft Bhatura',
        shapeType: SHAPES.OVAL,
        timeLimit: 30,
        passingScore: 65,
        character: {
          name: 'Manar Mathai',
          movie: 'Ramji Rao Speaking',
          avatar: '/characters/manar_mathai.jpg',
          dialogue: 'Hello Urvashi Theatres! Urvashi needs an oval Bhatura for her lunch box right now!',
          tagline: 'Theatre Manager'
        }
      }
    ]
  },
  {
    id: 'stage_2',
    title: 'Stage 2: Highway Dhaba 🟡',
    subtitle: 'Serve high-speed travelers & local legends',
    levels: [
      {
        id: 'level_3',
        levelNumber: 3,
        title: 'Crispy Paratha',
        shapeType: SHAPES.SQUARE,
        timeLimit: 25,
        passingScore: 70,
        character: {
          name: 'Anjooran',
          movie: 'Godfather',
          avatar: '/characters/anjooran.jpg',
          dialogue: 'No women allowed in my kitchen, and NO ROUND ROTIS! Roll me a strictly 4-cornered square paratha!',
          tagline: 'Strict Patriarch'
        }
      },
      {
        id: 'level_4',
        levelNumber: 4,
        title: 'Samosa Naan',
        shapeType: SHAPES.TRIANGLE,
        timeLimit: 25,
        passingScore: 72,
        character: {
          name: 'Mangalassery Neelakandan',
          movie: 'Devasuram',
          avatar: '/characters/neelakandan.jpg',
          dialogue: 'Mundakkal Shekaran thinks he can cook? Show him Neelakandan\'s sharp 3-cornered triangle naan!',
          tagline: 'Feudal Hero'
        }
      }
    ]
  },
  {
    id: 'stage_3',
    title: 'Stage 3: Royal Palace Banquet 🔴',
    subtitle: 'Prepare exquisite shapes for royal guests',
    levels: [
      {
        id: 'level_5',
        levelNumber: 5,
        title: 'Dil-Se Roti',
        shapeType: SHAPES.HEART,
        timeLimit: 22,
        passingScore: 75,
        character: {
          name: 'Nagavalli',
          movie: 'Manichitrathazhu',
          avatar: '/characters/nagavalli.jpg',
          dialogue: 'Vidhyaaa! Give Nagavalli a romantic Heart Roti or she will dance her furious Anklet dance!',
          tagline: 'Royal Classical Dancer'
        }
      },
      {
        id: 'level_6',
        levelNumber: 6,
        title: 'Chand Naan',
        shapeType: SHAPES.CRESCENT,
        timeLimit: 20,
        passingScore: 78,
        character: {
          name: 'Dr. Sunny Joseph',
          movie: 'Manichitrathazhu',
          avatar: '/characters/dr_sunny.jpg',
          dialogue: 'Unni, this is pure psychology! A crescent moon naan calms Nagavalli\'s mind instantly!',
          tagline: 'Eccentric Psychiatrist'
        }
      },
      {
        id: 'level_7',
        levelNumber: 7,
        title: 'Shahi Star Roti',
        shapeType: SHAPES.STAR,
        timeLimit: 20,
        passingScore: 80,
        character: {
          name: 'Sethumadhavan',
          movie: 'Kireedam',
          avatar: '/characters/sethumadhavan.jpg',
          dialogue: 'Kireedam is not just a crown, it\'s a 5-pointed star! Roll me a royal star flatbread!',
          tagline: 'Tragic Hero'
        }
      }
    ]
  },
  {
    id: 'stage_4',
    title: 'Stage 4: World Roti Championship 🔥',
    subtitle: 'Face the ultimate hitman chef',
    levels: [
      {
        id: 'level_8',
        levelNumber: 8,
        title: 'Pavanayi\'s Briefcase Shape',
        shapeType: SHAPES.STAR,
        timeLimit: 15,
        passingScore: 85,
        character: {
          name: 'Pavanayi',
          movie: 'Nadodikkattu',
          avatar: '/characters/pavanayi.jpg',
          dialogue: 'Pavanayi ready! Match my secret shape or Pavanayi will finish your roti career forever!',
          tagline: 'Secret Assassin Chef'
        }
      }
    ]
  }
];

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
