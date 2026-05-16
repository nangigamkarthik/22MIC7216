export type NotificationType = "Placement" | "Result" | "Event";

export type NotificationItem = {
  ID: string;
  Type: NotificationType;
  Message: string;
  Timestamp: string;
  isRead?: boolean;
  read?: boolean;
};

export type RankedNotification = NotificationItem & {
  priorityWeight: number;
  timestampMs: number;
};

export type NotificationFeed = {
  notifications: NotificationItem[];
  source: "live-api" | "demo-data";
  sourceNote: string;
};

export type PriorityInboxSnapshot = {
  limit: number;
  totalFetched: number;
  source: NotificationFeed["source"];
  sourceNote: string;
  generatedAt: string;
  notifications: NotificationItem[];
};
