import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function HomePage() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Campus Notifications
        </Typography>
        <Typography sx={{ mb: 2 }}>
          This app now includes both Stage 1 and Stage 2 frontend features in
          the same project folder.
        </Typography>
        <Typography sx={{ mb: 3 }}>
          Use the pages below to view all notifications or only the top
          priority notifications.
        </Typography>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Button variant="contained" href="/all-notifications">
            All notifications
          </Button>
          <Button variant="outlined" href="/priority-notifications">
            Priority notifications
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
