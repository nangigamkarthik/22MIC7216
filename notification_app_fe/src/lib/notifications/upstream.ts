import { sampleNotifications } from "./sample-data";
import type { NotificationFeed, NotificationItem } from "./types";

const DEFAULT_API_URL =
  "http://4.224.186.213/evaluation-service/notifications";

function getEnvNumber(name: string, fallback: number) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function buildHeaders() {
  const headers = new Headers({
    Accept: "application/json",
  });

  if (process.env.NOTIFICATION_API_BEARER_TOKEN) {
    headers.set(
      "Authorization",
      `Bearer ${process.env.NOTIFICATION_API_BEARER_TOKEN}`,
    );
  }

  if (process.env.NOTIFICATION_API_KEY) {
    headers.set(
      process.env.NOTIFICATION_API_KEY_HEADER || "x-api-key",
      process.env.NOTIFICATION_API_KEY,
    );
  }

  return headers;
}

function toNotificationArray(payload: unknown) {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "notifications" in payload &&
    Array.isArray(payload.notifications)
  ) {
    return payload.notifications as NotificationItem[];
  }

  return [];
}

function buildDemoData(reason: string): NotificationFeed {
  return {
    notifications: sampleNotifications,
    source: "demo-data",
    sourceNote: reason,
  };
}

export async function getNotificationFeed(): Promise<NotificationFeed> {
  const apiUrl = process.env.NOTIFICATION_API_URL || DEFAULT_API_URL;
  const demoFallbackAllowed =
    process.env.NOTIFICATION_ALLOW_DEMO_FALLBACK !== "false";
  const hasServerCredential =
    Boolean(process.env.NOTIFICATION_API_BEARER_TOKEN) ||
    Boolean(process.env.NOTIFICATION_API_KEY);

  if (!hasServerCredential && demoFallbackAllowed) {
    return buildDemoData(
      "Running in demo mode because upstream credentials were not configured.",
    );
  }

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: buildHeaders(),
      cache: "no-store",
      signal: AbortSignal.timeout(
        getEnvNumber("NOTIFICATION_API_TIMEOUT_MS", 5000),
      ),
    });

    if (!response.ok) {
      const details = await response.text();

      if (demoFallbackAllowed) {
        return buildDemoData(
          `Upstream API returned ${response.status}. Demo data is shown until credentials or endpoint access are fixed.`,
        );
      }

      throw new Error(
        `Notification API returned ${response.status}. ${details || "No response body."}`,
      );
    }

    const payload = await response.json();

    return {
      notifications: toNotificationArray(payload),
      source: "live-api",
      sourceNote: "Protected notification API fetched successfully.",
    };
  } catch (error) {
    if (demoFallbackAllowed) {
      return buildDemoData(
        `Live fetch failed. Demo data is shown for local review. ${(error as Error).message}`,
      );
    }

    throw error;
  }
}
