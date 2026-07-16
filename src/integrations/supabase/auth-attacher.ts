import { createMiddleware } from "@tanstack/react-start";

export const attachSupabaseAuth = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    return next();
  },
);
