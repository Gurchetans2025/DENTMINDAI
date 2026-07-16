import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/appointment")({
  beforeLoad: () => {
    throw redirect({ href: "/#booking" });
  },
});
