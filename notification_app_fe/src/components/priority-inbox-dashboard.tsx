"use client";

import { useState } from "react";
import type { PriorityInboxSnapshot } from "@/lib/notifications/types";

type DashboardProps = {
  initialSnapshot: PriorityInboxSnapshot;
};

export function PriorityInboxDashboard({
  initialSnapshot,
}: DashboardProps) {
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [limit, setLimit] = useState(initialSnapshot.limit);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadNotifications(nextLimit: number) {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/priority-inbox?n=${nextLimit}`, {
        cache: "no-store",
      });

      const data = (await response.json()) as
        | PriorityInboxSnapshot
        | { error?: string };

      if (!response.ok || !("notifications" in data)) {
        throw new Error(
          "error" in data && data.error
            ? data.error
            : "Failed to load notifications.",
        );
      }

      setSnapshot(data);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Failed to load notifications.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <div className="box">
        <h1>Priority Inbox</h1>
        <p>Stage 1 frontend output for top priority notifications.</p>

        <div className="controls">
          <label htmlFor="limit">Top N</label>
          <select
            id="limit"
            value={limit}
            onChange={(event) => setLimit(Number(event.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
          <button type="button" onClick={() => void loadNotifications(limit)}>
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        <p className="small-text">
          Source: {snapshot.source === "live-api" ? "Live API" : "Demo data"}
        </p>
        <p className="small-text">{snapshot.sourceNote}</p>

        {error ? <p className="error-text">{error}</p> : null}

        <ul className="notification-list">
          {snapshot.notifications.map((notification, index) => (
            <li key={notification.ID} className="notification-item">
              <p>
                <strong>Rank:</strong> {index + 1}
              </p>
              <p>
                <strong>Type:</strong> {notification.Type}
              </p>
              <p>
                <strong>Message:</strong> {notification.Message}
              </p>
              <p>
                <strong>Time:</strong> {notification.Timestamp}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
