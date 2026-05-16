import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import NotificationList from "@/components/notification-list";
import { getPriorityNotificationsPageData } from "@/lib/notifications/service";

type PageProps = {
  searchParams: Promise<{
    limit?: string;
    notification_type?: string;
  }>;
};

export default async function PriorityNotificationsPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const data = await getPriorityNotificationsPageData({
    limit: params.limit,
    notificationType: params.notification_type,
  });

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Priority Notifications
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            View the top n unread notifications ranked by type and recency.
          </Typography>

          <Box
            component="form"
            action="/priority-notifications"
            method="get"
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr auto" },
              gap: 2,
            }}
          >
            <TextField
              label="Top N"
              name="limit"
              type="number"
              defaultValue={data.limit}
              slotProps={{ htmlInput: { min: 1 } }}
            />
            <TextField
              label="Notification Type"
              name="notification_type"
              select
              defaultValue={data.selectedType}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Placement">Placement</MenuItem>
              <MenuItem value="Result">Result</MenuItem>
              <MenuItem value="Event">Event</MenuItem>
            </TextField>
            <Button type="submit" variant="contained">
              Apply
            </Button>
          </Box>
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Typography variant="body2">
            Source: {data.source === "live-api" ? "Live API" : "Demo data"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {data.sourceNote}
          </Typography>
        </Paper>

        <NotificationList notifications={data.notifications} showRank />
      </Stack>
    </Container>
  );
}
