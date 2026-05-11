export function toActionError(err: unknown): Error {
  if (err instanceof Error) return err;
  return new Error("Something went wrong. Please try again.");
}
