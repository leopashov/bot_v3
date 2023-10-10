export function handleError(err: unknown, customMessage?: string): void {
  if (err instanceof Error) {
    console.error(
      `${customMessage ? customMessage + " " : ""}Error: ${err.message}`
    );
  } else {
    console.error("An unknown error occurred:", err);
  }
}
