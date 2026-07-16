import { captureError } from "./error-capture";

export function reportLovableError(error: unknown, context?: Record<string, unknown>) {
  captureError({ error, context });
}
