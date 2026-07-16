import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/appointment")({
  component: AppointmentPage,
});

function AppointmentPage() {
  return <div>Appointment Page</div>;
}
