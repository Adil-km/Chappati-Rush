import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  query, 
  orderBy, 
  limit, 
  getDocs, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Saves user score to Firestore leaderboard if new score > existing score.
 */
export async function saveUserScoreToFirestore(user, totalScore, completionTime, shapeTitle = 'Circle') {
  if (!db || !user) return null;

  try {
    const docRef = doc(db, 'leaderboard', user.uid);
    const docSnap = await getDoc(docRef);

    let isNewHigh = true;
    if (docSnap.exists()) {
      const existingData = docSnap.data();
      if ((existingData.totalScore || 0) > totalScore) {
        isNewHigh = false;
      } else if (existingData.totalScore === totalScore && (existingData.completionTime || 0) <= completionTime) {
        isNewHigh = false;
      }
    }

    if (isNewHigh) {
      await setDoc(docRef, {
        uid: user.uid,
        displayName: user.displayName || 'Anonymous Roti Chef',
        photoURL: user.photoURL || '',
        totalScore,
        completionTime,
        shapeTitle,
        updatedAt: serverTimestamp()
      }, { merge: true });
    }

    return isNewHigh;
  } catch (error) {
    console.error('Firestore save score error:', error);
    return false;
  }
}

/**
 * Robustly fetches top global players with double-fallback to prevent index errors.
 */
export async function fetchGlobalLeaderboard(limitCount = 10) {
  if (!db) return [];

  const leaderboardRef = collection(db, 'leaderboard');

  // Attempt 1: Single field index query by totalScore desc
  try {
    const q = query(leaderboardRef, orderBy('totalScore', 'desc'), limit(limitCount * 2));
    const snapshot = await getDocs(q);
    const results = [];
    snapshot.forEach(docSnap => {
      results.push({ id: docSnap.id, ...docSnap.data() });
    });
    // Sort tie-breakers (higher score first, then lower completion time)
    results.sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0) || (a.completionTime || 0) - (b.completionTime || 0));
    return results.slice(0, limitCount);
  } catch (err) {
    console.warn('Ordered query failed, falling back to simple collection fetch:', err);
    
    // Attempt 2: Simple fetch without any orderBy clause (Zero index requirements)
    try {
      const snapshot = await getDocs(leaderboardRef);
      const results = [];
      snapshot.forEach(docSnap => {
        results.push({ id: docSnap.id, ...docSnap.data() });
      });
      results.sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0) || (a.completionTime || 0) - (b.completionTime || 0));
      return results.slice(0, limitCount);
    } catch (fallbackErr) {
      console.error('Firestore leaderboard fetch error:', fallbackErr);
      return [];
    }
  }
}
