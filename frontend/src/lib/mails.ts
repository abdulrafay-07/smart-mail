import type { Mails } from "@/types/mails";
import { TrendingDown, TrendingUp } from "lucide-react";

export const getMailsCardData = (mails: Mails, userEmail: string) => {
  // Unread mails
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayUnreadMailsCount = mails.filter((mail) => {
    const mailDate = new Date(mail.date);
    return (
      mail.labels?.includes("UNREAD") &&
      mailDate.getFullYear() === today.getFullYear() &&
      mailDate.getMonth() === today.getMonth() &&
      mailDate.getDate() === today.getDate()
    );
  }).length;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  const yesterdayUnreadMailsCount = mails.filter((mail) => {
    const mailDate = new Date(mail.date);
    return ((
      mail.labels?.includes("UNREAD") &&
      mailDate.getFullYear() === yesterday.getFullYear() &&
      mailDate.getMonth() === yesterday.getMonth() &&
      mailDate.getDate() === yesterday.getDate()
    ));
  }).length;

  const unreadDiff = todayUnreadMailsCount - yesterdayUnreadMailsCount;
  let unreadTrendDesc = "Same as yesterday";
  let unreadTrendIcon = TrendingUp;
  let unreadTrendColor = "text-green-700";

  if (yesterdayUnreadMailsCount > 0) {
    const percent = Math.abs(Math.round((unreadDiff / yesterdayUnreadMailsCount) * 100));
    if (unreadDiff < 0) {
      unreadTrendDesc = `${percent}% less than yesterday`;
      unreadTrendIcon = TrendingDown;
      unreadTrendColor = "text-destructive";
    } else if (unreadDiff > 0) {
      unreadTrendDesc = `${percent}% more than yesterday`;
      unreadTrendIcon = TrendingUp;
      unreadTrendColor = "text-green-700";
    }
  } else if (todayUnreadMailsCount > 0) {
    unreadTrendDesc = "More than yesterday";
    unreadTrendIcon = TrendingUp;
    unreadTrendColor = "text-destructive";
  };

  // Inbox health
  let score = 100;

  const totalUnreadCount = mails.filter(m => m.labels?.includes("UNREAD")).length;
  const totalUnrepliedImpEmails = mails.filter(m => m.labels?.includes("IMPORTANT") && m.labels.includes("UNREAD")).length;

  if (totalUnreadCount > 50) {
    score -= 10;
  };

  if (totalUnrepliedImpEmails > 10) {
    score -= 15;
  };

  score -= Math.ceil(Math.random() * 10);

  // Response rate
  const threshold = 40;
  const threadStats = new Map();

  for (const mail of mails) {
    const threadId = mail.threadId;
    if (!threadStats.has(threadId)) {
      threadStats.set(threadId, {
        inboundCount: 0,
        userReplied: false,
      });
    }

    const stats = threadStats.get(threadId);

    if (mail.from.toLowerCase() !== userEmail.toLowerCase()) {
      stats.inboundCount++;
    } else {
      stats.userReplied = true;
    }
  }

  let totalRelevantThreads = 0;
  let repliedThreads = 0;

  for (const [_, stats] of threadStats) {
    if (stats.inboundCount > 0) {
      totalRelevantThreads++;
      if (stats.userReplied) repliedThreads++;
    }
  }

  const responseRate =
    totalRelevantThreads > 0
      ? (repliedThreads / totalRelevantThreads) * 100
      : 0;

  let responseRateMsg = "";
  let responseRateIcon;
  if (responseRate > threshold) {
    responseRateMsg = "Great job! You can do better";
    responseRateIcon = TrendingUp;
  } else {
    responseRateMsg = "It's not good";
    responseRateIcon = TrendingDown;
  }

  return {
    unreadTrendDesc,
    unreadTrendIcon,
    unreadTrendColor,
    todayUnreadMailsCount,
    score,
    responseRate,
    responseRateMsg,
    responseRateIcon
  };
};

export const getMailsAnalyticsData = (mails: Mails) => {
  const categoryColors: string[] = [
    "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#6366f1", "#f472b6", "#facc15", "#14b8a6", "#a3e635"
  ];

  const categoryCount = new Map<string, number>();

  for (const mail of mails) {
    const category = mail.category
      ? mail.category[0].toUpperCase() + mail.category.substring(1).toLowerCase()
      : "Other";
    categoryCount.set(category, (categoryCount.get(category) || 0) + 1);
  };

  const total = Array.from(categoryCount.values()).reduce((sum, count) => sum + count, 0);

  let colorIndex = 0;
  const categoryData = Array.from(categoryCount.entries()).map(([name, count]) => {
    const color = categoryColors[colorIndex % categoryColors.length];
    colorIndex++;
    const value = total > 0 ? Math.round((count / total) * 100) : 0;
    return { name, value, color };
  });

  // Calculate emails per day of week for the current week
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const emailsPerDay = Array(7).fill(0);

  // Get start of current week (Sunday)
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(now.getDate() - now.getDay());

  for (const mail of mails) {
    const mailDate = new Date(mail.date);
    mailDate.setHours(0, 0, 0, 0);
    if (mailDate >= startOfWeek && mailDate <= now) {
      const dayIdx = mailDate.getDay();
      emailsPerDay[dayIdx]++;
    };
  };

  const chartData = daysOfWeek.map((day, idx) => ({
    day,
    emails: emailsPerDay[idx],
  }));

  return {
    categoryData,
    chartData,
  };
};
