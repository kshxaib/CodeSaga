import { db } from './db.js';

export const updateUserStreak = async (userId) => {
  try {
    const user = await db.user.findUnique({
      where: { id: userId }
    });

    const today = new Date();
    const lastSolved = user.lastSolvedDate;

    console.log(`🧠 lastSolved: ${lastSolved}, today: ${today}`);

    // Case 1: Already solved today — don't update
    if (lastSolved && isSameDay(today, lastSolved)) {
      console.log("✅ Already submitted today, not updating streak.");
      return;
    }

    // Case 2: Solved yesterday — increment streak
    // Case 3: Missed a day — reset streak to 1
    const newStreak = lastSolved && isConsecutiveDay(today, lastSolved)
      ? user.currentStreak + 1
      : 1;

    await db.user.update({
      where: { id: userId },
      data: {
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, user.longestStreak),
        lastSolvedDate: today
      }
    });

    console.log(`🔥 Streak updated to ${newStreak}`);
  } catch (error) {
    console.error("❌ Error while updating user's streak:", error);
  }
};

// Helper: Check if two dates are on the same day
const isSameDay = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.toDateString() === d2.toDateString();
};

const isConsecutiveDay = (date1, date2) => {
  const d1 = new Date(date1.setHours(0, 0, 0, 0));
  const d2 = new Date(new Date(date2).setHours(0, 0, 0, 0));
  const diff = d1 - d2;
  return diff === 1000 * 60 * 60 * 24;
};
