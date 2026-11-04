export function createSingleFlight<T>(run: () => Promise<T>): () => Promise<T> {
  let current: Promise<T> | null = null;

  return () => {
    if (!current) {
      current = run().finally(() => {
        current = null;
      });
    }
    return current;
  };
}
