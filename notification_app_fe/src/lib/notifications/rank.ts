import type { NotificationItem, RankedNotification } from "./types";

export const TYPE_WEIGHTS = {
  Placement: 3,
  Result: 2,
  Event: 1,
} as const;

function parseTimestamp(timestamp: string) {
  const timestampMs = new Date(timestamp).getTime();
  return Number.isNaN(timestampMs) ? 0 : timestampMs;
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

function comparePriority(left: RankedNotification, right: RankedNotification) {
  if (left.priorityWeight !== right.priorityWeight) {
    return left.priorityWeight - right.priorityWeight;
  }

  return left.timestampMs - right.timestampMs;
}

class MinHeap {
  private readonly items: RankedNotification[] = [];

  size() {
    return this.items.length;
  }

  peek() {
    return this.items[0];
  }

  push(item: RankedNotification) {
    this.items.push(item);
    this.bubbleUp(this.items.length - 1);
  }

  replaceTop(item: RankedNotification) {
    this.items[0] = item;
    this.bubbleDown(0);
  }

  toSortedArray() {
    return [...this.items].sort((left, right) => comparePriority(right, left));
  }

  private bubbleUp(index: number) {
    let currentIndex = index;

    while (currentIndex > 0) {
      const parentIndex = Math.floor((currentIndex - 1) / 2);

      if (
        comparePriority(this.items[currentIndex], this.items[parentIndex]) >= 0
      ) {
        break;
      }

      [this.items[currentIndex], this.items[parentIndex]] = [
        this.items[parentIndex],
        this.items[currentIndex],
      ];
      currentIndex = parentIndex;
    }
  }

  private bubbleDown(index: number) {
    let currentIndex = index;
    const lastIndex = this.items.length - 1;

    while (true) {
      const leftIndex = currentIndex * 2 + 1;
      const rightIndex = leftIndex + 1;
      let smallestIndex = currentIndex;

      if (
        leftIndex <= lastIndex &&
        comparePriority(this.items[leftIndex], this.items[smallestIndex]) < 0
      ) {
        smallestIndex = leftIndex;
      }

      if (
        rightIndex <= lastIndex &&
        comparePriority(this.items[rightIndex], this.items[smallestIndex]) < 0
      ) {
        smallestIndex = rightIndex;
      }

      if (smallestIndex === currentIndex) {
        break;
      }

      [this.items[currentIndex], this.items[smallestIndex]] = [
        this.items[smallestIndex],
        this.items[currentIndex],
      ];
      currentIndex = smallestIndex;
    }
  }
}

function toRankedNotification(
  notification: NotificationItem,
): RankedNotification {
  return {
    ...notification,
    priorityWeight: TYPE_WEIGHTS[notification.Type] ?? 0,
    timestampMs: parseTimestamp(notification.Timestamp),
  };
}

function stripRankFields(notification: RankedNotification): NotificationItem {
  return {
    ID: notification.ID,
    Type: notification.Type,
    Message: notification.Message,
    Timestamp: notification.Timestamp,
    ...(typeof notification.isRead === "boolean"
      ? { isRead: notification.isRead }
      : {}),
    ...(typeof notification.read === "boolean"
      ? { read: notification.read }
      : {}),
  };
}

export function selectTopNotifications(
  notifications: NotificationItem[],
  limit = 10,
) {
  const safeLimit = Number.isInteger(limit) && limit > 0 ? limit : 10;
  const heap = new MinHeap();

  for (const notification of notifications) {
    if (!isUnread(notification)) {
      continue;
    }

    const rankedNotification = toRankedNotification(notification);

    if (heap.size() < safeLimit) {
      heap.push(rankedNotification);
      continue;
    }

    if (comparePriority(rankedNotification, heap.peek()) > 0) {
      heap.replaceTop(rankedNotification);
    }
  }

  return heap.toSortedArray().map(stripRankFields);
}
