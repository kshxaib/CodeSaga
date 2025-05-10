import {db} from "../libs/db.js"

const badges = [
  {
    name: "Quick Thinker",
    description: "Solve 10 problems in under 30 minutes",
    icon: "⚡"
  },
  {
    name: "Marathon Coder",
    description: "Solve at least one problem daily for 30 consecutive days",
    icon: "🏃‍♂️"
  },
  {
    name: "Topic Master",
    description: "Solve 20 problems in a single topic/tag",
    icon: "🎯"
  },
  {
    name: "Gold Medallist",
    description: "Top 10% in a weekly challenge leaderboard",
    icon: "🥇"
  },
  {
    name: "Night Owl",
    description: "Solve 10 problems between 12 AM and 4 AM",
    icon: "🌙"
  },
  {
    name: "Bug Hunter",
    description: "Report or fix 5 valid bugs in challenges",
    icon: "🔍"
  },
  {
    name: "Rising Star",
    description: "Gain 100 upvotes on solutions",
    icon: "🌟"
  },
  {
    name: "Mentor Mind",
    description: "Help 10 users in discussions/comments",
    icon: "🧠"
  },
  {
    name: "Comeback Kid",
    description: "Resume activity after 15+ days of inactivity",
    icon: "🔄"
  },
  {
    name: "All-Rounder",
    description: "Solve at least one problem in 5 different categories",
    icon: "🔁"
  },
  {
    name: "Perfectionist",
    description: "Solve 10 problems with 100% accuracy on first try",
    icon: "✅"
  },
  {
    name: "Community Hero",
    description: "Reach 50 reputation via votes/comments",
    icon: "🤝"
  },
  {
    name: "Explorer",
    description: "Visit the platform on 20 unique days",
    icon: "🧭"
  },
  {
    name: "Code Artist",
    description: "Write 10 solutions rated for clean code",
    icon: "🎨"
  },
  {
    name: "First Blood",
    description: "Be the first to solve a new challenge",
    icon: "🩸"
  },
  {
    name: "Consistency King",
    description: "Log in and solve for 60 consecutive days",
    icon: "👑"
  },
  {
    name: "Debugger",
    description: "Fix 10 failed submissions or incorrect solutions",
    icon: "🐞"
  },
  {
    name: "Language Lover",
    description: "Solve problems in 3+ programming languages",
    icon: "💬"
  },
  {
    name: "Speedrunner",
    description: "Beat the average solve time for 10 problems",
    icon: "🚀"
  },
  {
    name: "Legendary Learner",
    description: "Earn 10 other badges",
    icon: "🏆"
  }
];

export const BADGE_CRITERIA = {
  QUICK_THINKER: {
    requiredSubmissions: 10,
    maxTime: 1800 // 30 minutes in seconds
  },
  MARATHON_CODER: {
    requiredConsecutiveDays: 30,
    requiredSubmissionsPerDay: 1
  },
  TOPIC_MASTER: {
    requiredSubmissions: 20,
    tag: "any" // You can specify the tag or topic here if required
  },
  GOLD_MEDALLIST: {
    leaderboardRankPercentage: 10, // Top 10% in leaderboard
    challengeType: "weekly" // Can be specified as weekly or other challenge types
  },
  NIGHT_OWL: {
    requiredSubmissions: 10,
    timeWindow: {
      start: 0, // 12 AM in hours
      end: 4 // 4 AM in hours
    }
  },
  BUG_HUNTER: {
    requiredBugsFixedOrReported: 5
  },
  RISING_STAR: {
    requiredUpvotes: 100
  },
  MENTOR_MIND: {
    requiredHelpCount: 10,
    typeOfHelp: "discussions/comments"
  },
  COMEBACK_KID: {
    requiredInactivityPeriod: 15 // 15+ days of inactivity
  },
  ALL_ROUNDER: {
    requiredCategories: 5, // Must solve at least one problem in 5 different categories
    requiredSubmissionsPerCategory: 1
  },
  PERFECTIONIST: {
    requiredSubmissions: 10,
    accuracy: 100 // 100% accuracy on first try
  },
  COMMUNITY_HERO: {
    requiredReputation: 50,
    earnedThrough: ["votes", "comments"]
  },
  EXPLORER: {
    requiredUniqueVisits: 20
  },
  CODE_ARTIST: {
    requiredCleanCodeRatedSolutions: 10
  },
  FIRST_BLOOD: {
    requiredSubmissionType: "first", // First to solve a new challenge
  },
  CONSISTENCY_KING: {
    requiredConsecutiveLoginDays: 60
  },
  DEBUGGER: {
    requiredFixes: 10,
    submissionType: "failed" // Fix failed or incorrect solutions
  },
  LANGUAGE_LOVER: {
    requiredLanguages: 3, // Solve problems in 3+ programming languages
  },
  SPEEDRUNNER: {
    requiredSubmissions: 10,
    timeCondition: "average", // Beat the average solve time
  },
  LEGENDARY_LEARNER: {
    requiredBadges: 10 // Earn 10 other badges
  }
};


async function seedBadges() {
  try {
    await db.badge.createMany({
      data: badges,
      skipDuplicates: true 
    });
    console.log("created successfully!");
  } catch (error) {
    console.error(error);
  } 
}

seedBadges()
