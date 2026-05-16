"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { NotificationItem } from "@/lib/notifications/types";

type NotificationListProps = {
  notifications: NotificationItem[];
  showRank?: boolean;
};

const storageKey = "notification-app-viewed";

export default function NotificationList({
  notifications,
  showRank = false,
}: NotificationListProps) {
  const [viewedIds, setViewedIds] = useState<string[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const savedValue = window.localStorage.getItem(storageKey);

    if (!savedValue) {
      return [];
    }

    try {
      const parsedValue = JSON.parse(savedValue) as string[];
      return Array.isArray(parsedValue) ? parsedValue : [];
    } catch {
      window.localStorage.removeItem(storageKey);
      return [];
    }
  });

  function markAsViewed(id: string) {
    const nextIds = Array.from(new Set([...viewedIds, id]));
    setViewedIds(nextIds);
    window.localStorage.setItem(storageKey, JSON.stringify(nextIds));
  }

  if (notifications.length === 0) {
    return (
      <Typography color="text.secondary">
        No notifications found for the selected options.
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      {notifications.map((notification, index) => {
        const isViewed = viewedIds.includes(notification.ID);

        return (
          <Card key={notification.ID} variant="outlined">
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "space-between",
                  gap: 1,
                  mb: 1,
                }}
              >
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {showRank ? (
                    <Chip label={`Rank ${index + 1}`} size="small" />
                  ) : null}
                  <Chip label={notification.Type} size="small" color="primary" />
                  <Chip
                    label={isViewed ? "Viewed" : "New"}
                    size="small"
                    color={isViewed ? "default" : "success"}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {notification.Timestamp}
                </Typography>
              </Box>

              <Typography variant="h6" gutterBottom>
                {notification.Message}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ID: {notification.ID}
              </Typography>
            </CardContent>

            <CardActions>
              <Button
                size="small"
                variant="outlined"
                onClick={() => markAsViewed(notification.ID)}
                disabled={isViewed}
              >
                {isViewed ? "Already viewed" : "Mark as viewed"}
              </Button>
            </CardActions>
          </Card>
        );
      })}
    </Stack>
  );
}
