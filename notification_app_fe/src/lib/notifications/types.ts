export type NotificationType = "Placement" | "Result" | "Event";
export type NotificationFilter = NotificationType | "All";

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

export type AllNotificationsPageData = {
  notifications: NotificationItem[];
  source: NotificationFeed["source"];
  sourceNote: string;
  page: number;
  limit: number;
  selectedType: NotificationFilter;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type PriorityNotificationsPageData = {
  notifications: NotificationItem[];
  source: NotificationFeed["source"];
  sourceNote: string;
  limit: number;
  selectedType: NotificationFilter;
};
