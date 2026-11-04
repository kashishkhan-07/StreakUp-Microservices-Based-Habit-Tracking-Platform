/**
 * MilestoneNotificationEngine - Generates fun, motivating milestone and
 * achievement notifications with XP rewards, combos, and category flair.
 */

export class DuoNotificationEngine {
  /**
   * Main entrypoint to generate a rich notification from RabbitMQ event data
   */
  static generateNotification(eventType, payload) {
    const {
      habitTitle = 'Habit',
      habitCategory = 'General',
      totalCompletedToday = 1,
      habitTotalCompletions = 1,
      date = new Date().toISOString().split('T')[0],
    } = payload || {};

    // 1. Habit Created Event
    if (eventType === 'habit.created.v1') {
      return {
        title: `New Habit Created! 🚀`,
        message: `"${habitTitle}" added to your daily tracker! The journey begins with a single step. Let's make day 1 count!`,
        type: 'quest',
        icon: '🚀',
        level: 'New Habit',
        xpEarned: 15,
        habitTitle,
      };
    }

    // 2. Lifetime Habit Milestones (High Priority)
    if (habitTotalCompletions === 1) {
      return {
        title: `First Step Taken! Level 1 Unlocked! 🎯`,
        message: `You completed "${habitTitle}" for the very first time! Starting is half the battle won. Future you says thank you!`,
        type: 'achievement',
        icon: '🎯',
        level: 'Level 1 Unlocked',
        xpEarned: 25,
        habitTitle,
      };
    }

    if (habitTotalCompletions === 5) {
      return {
        title: `High Five! 5 Sessions In! 🖐️`,
        message: `5 completions on "${habitTitle}"! You're laying solid foundations for a permanent habit loop. Keep the momentum going! 🎉`,
        type: 'achievement',
        icon: '🖐️',
        level: 'Foundation Built',
        xpEarned: 35,
        habitTitle,
      };
    }

    if (habitTotalCompletions === 10) {
      return {
        title: `Double-Digit Club Unlocked! 🔟`,
        message: `10 sessions of "${habitTitle}" crushed! You’ve crossed into serious consistency territory. Silver Habit Badge earned! 🛡️`,
        type: 'achievement',
        icon: '🔟',
        level: 'Silver Consistency',
        xpEarned: 50,
        habitTitle,
      };
    }

    if (habitTotalCompletions === 21) {
      return {
        title: `21-Day Habit Milestone! 🧠`,
        message: `21 completions of "${habitTitle}"! Behavioral science says this habit is now wired into your lifestyle. Pure consistency! 🏆`,
        type: 'milestone',
        icon: '🏆',
        level: 'Habit Formed (21D)',
        xpEarned: 100,
        habitTitle,
      };
    }

    if (habitTotalCompletions === 50) {
      return {
        title: `Half-Century Habit Hero! 👑`,
        message: `50 completions of "${habitTitle}"! You're officially in the top 1% of dedicated habit builders. Keep dominating! 🔥`,
        type: 'milestone',
        icon: '👑',
        level: 'Gold Tier Master',
        xpEarned: 150,
        habitTitle,
      };
    }

    if (habitTotalCompletions === 100) {
      return {
        title: `Century Club: Immortal Status! 💎`,
        message: `100 sessions of "${habitTitle}"! Golden Trophy unlocked. You didn't just build a habit—you transformed your daily identity! 🌟`,
        type: 'milestone',
        icon: '💎',
        level: 'Century Master',
        xpEarned: 250,
        habitTitle,
      };
    }

    // 3. Daily Multipliers & Combos
    if (totalCompletedToday === 3) {
      return {
        title: `HAT TRICK! 3 Habits Crushed Today! 🎯`,
        message: `Triple threat! That's 3 habits knocked out for ${date}. Outstanding momentum! 🕺`,
        type: 'streak',
        icon: '🎯',
        level: 'Hat-trick x3',
        xpEarned: 45,
        habitTitle,
      };
    }

    if (totalCompletedToday >= 4) {
      return {
        title: `UNSTOPPABLE RAMPAGE: ${totalCompletedToday} Habits! 🔥`,
        message: `You are on absolute fire! ${totalCompletedToday} habits crushed today. Consistency is compounding into great results!`,
        type: 'streak',
        icon: '🔥',
        level: `Rampage x${totalCompletedToday}`,
        xpEarned: 60,
        habitTitle,
      };
    }

    if (totalCompletedToday === 2) {
      return {
        title: `Double Trouble! 2-in-a-Row! ⚡`,
        message: `Second habit of the day down! You're officially in the productive flow zone. Keep that momentum rolling!`,
        type: 'streak',
        icon: '⚡',
        level: 'Combo x2',
        xpEarned: 30,
        habitTitle,
      };
    }

    // 4. Category-Specific Achievements
    const normalizedCategory = (habitCategory || '').toLowerCase();

    if (normalizedCategory.includes('fitness') || normalizedCategory.includes('health')) {
      const fitnessLines = [
        {
          title: `Beast Mode: ACTIVATED! 💪`,
          message: `"${habitTitle}" crushed! Another deposit into your physical health bank. Future you is smiling!`,
          icon: '💪',
          level: 'Iron Will',
          xpEarned: 25,
        },
        {
          title: `Sweating Today, Shining Tomorrow! 🏃`,
          message: `Physical discipline beats motivation every single day. Great work checking off "${habitTitle}"!`,
          icon: '🏃',
          level: 'Fitness Boost',
          xpEarned: 25,
        },
      ];
      return {
        ...fitnessLines[Math.floor(Math.random() * fitnessLines.length)],
        type: 'achievement',
        habitTitle,
      };
    }

    if (normalizedCategory.includes('learn') || normalizedCategory.includes('read') || normalizedCategory.includes('study')) {
      return {
        title: `Brain XP: +1 Level! 📚`,
        message: `"${habitTitle}" finished! Big brain energy unlocked. Knowledge is your greatest compounding asset.`,
        type: 'achievement',
        icon: '📚',
        level: 'Brain Power',
        xpEarned: 30,
        habitTitle,
      };
    }

    if (normalizedCategory.includes('mind') || normalizedCategory.includes('meditat') || normalizedCategory.includes('spirit')) {
      return {
        title: `Inner Zen Restored! 🧘`,
        message: `"${habitTitle}" logged. Take a deep, peaceful breath. Calm mind, razor-sharp clarity for the day!`,
        type: 'achievement',
        icon: '🧘',
        level: 'Inner Peace',
        xpEarned: 25,
        habitTitle,
      };
    }

    if (normalizedCategory.includes('work') || normalizedCategory.includes('productiv') || normalizedCategory.includes('code')) {
      return {
        title: `Deep Work Victory! 🚀`,
        message: `"${habitTitle}" accomplished like a boss! You chose execution over procrastination. Keep building!`,
        type: 'achievement',
        icon: '🚀',
        level: 'Deep Work',
        xpEarned: 30,
        habitTitle,
      };
    }

    // 5. Classic Milestone Rotating Quips
    const classicQuips = [
      {
        title: `Look At You Being All Disciplined! ✨`,
        message: `"${habitTitle}" logged for ${date}. 1% better every day adds up to 37x better in a year!`,
        icon: '✨',
        level: 'Streak Protected',
        xpEarned: 25,
      },
      {
        title: `The Flame Burns Brighter! 🔥`,
        message: `You showed up for "${habitTitle}" when most people would have made excuses. Great job!`,
        icon: '🔥',
        level: 'Flame Master',
        xpEarned: 25,
      },
      {
        title: `Consistency Level: Elite! 💎`,
        message: `Another checkmark on "${habitTitle}". Keep compounding those daily gains!`,
        icon: '💎',
        level: 'Diamond League',
        xpEarned: 25,
      },
      {
        title: `Momentum Mode: ON! ⚡`,
        message: `You didn't break the chain! "${habitTitle}" complete. Every checkmark builds self-trust.`,
        icon: '⚡',
        level: 'Momentum Shield',
        xpEarned: 25,
      },
    ];

    const chosen = classicQuips[Math.floor(Math.random() * classicQuips.length)];
    return {
      ...chosen,
      type: 'milestone',
      habitTitle,
    };
  }
}
