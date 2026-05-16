import { selectTopNotifications } from "./rank";
import { getNotificationFeed } from "./upstream";
import type { PriorityInboxSnapshot } from "./types";

export async function getPriorityInboxSnapshot(
  limit = 10,
): Promise<PriorityInboxSnapshot> {
  const safeLimit = Number.isInteger(limit) && limit > 0 ? limit : 10;
  const feed = await getNotificationFeed();

  return {
    limit: safeLimit,
    totalFetched: feed.notifications.length,
    source: feed.source,
    sourceNote: feed.sourceNote,
    generatedAt: new Date().toISOString(),
    notifications: selectTopNotifications(feed.notifications, safeLimit),
  };
}
