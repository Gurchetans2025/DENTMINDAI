import { createFileRoute } from "@tanstack/react-router";

import { HealthyGrinzAdmin } from "@/features/admin/AdminPanel";

export const Route = createFileRoute("/admin")({ component: HealthyGrinzAdmin });
