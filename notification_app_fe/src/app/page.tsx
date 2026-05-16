import { PriorityInboxDashboard } from "@/components/priority-inbox-dashboard";
import { getPriorityInboxSnapshot } from "@/lib/notifications/service";

export default async function Home() {
  const snapshot = await getPriorityInboxSnapshot(10);

  return <PriorityInboxDashboard initialSnapshot={snapshot} />;
}
