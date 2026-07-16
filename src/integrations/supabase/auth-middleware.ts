export function withAuthMiddleware(handler: () => Promise<unknown>) {
  return handler();
}
