import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import NotificationList from "@/components/notification-list";
import { getAllNotificationsPageData } from "@/lib/notifications/service";

type PageProps = {
  searchParams: Promise<{
    limit?: string;
    page?: string;
    notification_type?: string;
  }>;
};

function buildPageLink(page: number, limit: number, notificationType: string) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));

  if (notificationType !== "All") {
    params.set("notification_type", notificationType);
  }

  return `/all-notifications?${params.toString()}`;
}

export default async function AllNotificationsPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const data = await getAllNotificationsPageData({
    limit: params.limit,
    page: params.page,
    notificationType: params.notification_type,
  });

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            All Notifications
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            View all notifications with simple pagination and type filtering.
          </Typography>

          <Box
            component="form"
            action="/all-notifications"
            method="get"
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr auto" },
              gap: 2,
            }}
          >
            <TextField
              label="Limit"
              name="limit"
              type="number"
              defaultValue={data.limit}
              slotProps={{ htmlInput: { min: 1 } }}
            />
            <TextField
              label="Page"
              name="page"
              type="number"
              defaultValue={data.page}
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

        <NotificationList notifications={data.notifications} />

        <Paper sx={{ p: 2 }}>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              href={buildPageLink(
                data.page - 1,
                data.limit,
                data.selectedType,
              )}
              disabled={!data.hasPreviousPage}
            >
              Previous
            </Button>
            <Button
              variant="outlined"
              href={buildPageLink(
                data.page + 1,
                data.limit,
                data.selectedType,
              )}
              disabled={!data.hasNextPage}
            >
              Next
            </Button>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
