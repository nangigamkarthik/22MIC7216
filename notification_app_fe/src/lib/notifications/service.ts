import { selectTopNotifications } from "./rank";
import { getNotificationFeed } from "./upstream";
import type {
  AllNotificationsPageData,
  NotificationFilter,
  NotificationItem,
  PriorityInboxSnapshot,
  PriorityNotificationsPageData,
} from "./types";

function toPositiveNumber(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function getSelectedType(value: string | undefined): NotificationFilter {
  if (
    value === "Placement" ||
    value === "Result" ||
    value === "Event"
  ) {
    return value;
  }

  return "All";
}

function isUnread(notification: NotificationItem) {
  if (typeof notification.isRead === "boolean") {
    return !notification.isRead;
  }

  if (typeof notification.read === "boolean") {
    return !notification.read;
  }

  return true;
}

function applyTypeFilter(
  notifications: NotificationItem[],
  selectedType: NotificationFilter,
) {
  if (selectedType === "All") {
    return notifications;
  }

  return notifications.filter((item) => item.Type === selectedType);
}

function paginateNotifications(
  notifications: NotificationItem[],
  page: number,
  limit: number,
) {
  const start = (page - 1) * limit;
  return notifications.slice(start, start + limit);
}

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

export async function getAllNotificationsPageData(input: {
  limit?: string;
  page?: string;
  notificationType?: string;
}): Promise<AllNotificationsPageData> {
  const limit = toPositiveNumber(input.limit, 10);
  const page = toPositiveNumber(input.page, 1);
  const selectedType = getSelectedType(input.notificationType);

  const feed = await getNotificationFeed({
    limit,
    page,
    notificationType: selectedType,
  });

  if (feed.source === "demo-data") {
    const filtered = applyTypeFilter(feed.notifications, selectedType);
    const paged = paginateNotifications(filtered, page, limit);

    return {
      notifications: paged,
      source: feed.source,
      sourceNote: feed.sourceNote,
      page,
      limit,
      selectedType,
      hasPreviousPage: page > 1,
      hasNextPage: page * limit < filtered.length,
    };
  }

  return {
    notifications: feed.notifications,
    source: feed.source,
    sourceNote: feed.sourceNote,
    page,
    limit,
    selectedType,
    hasPreviousPage: page > 1,
    hasNextPage: feed.notifications.length === limit,
  };
}

export async function getPriorityNotificationsPageData(input: {
  limit?: string;
  notificationType?: string;
}): Promise<PriorityNotificationsPageData> {
  const limit = toPositiveNumber(input.limit, 10);
  const selectedType = getSelectedType(input.notificationType);

  const feed = await getNotificationFeed({
    notificationType: selectedType,
  });

  const filteredUnread = applyTypeFilter(feed.notifications, selectedType).filter(
    isUnread,
  );

  return {
    notifications: selectTopNotifications(filteredUnread, limit),
    source: feed.source,
    sourceNote: feed.sourceNote,
    limit,
    selectedType,
  };
}
