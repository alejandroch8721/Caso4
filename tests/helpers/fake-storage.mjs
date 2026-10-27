export function createFakeStorage(initialEntries = {}) {
  const entries = new Map(Object.entries(initialEntries));
  let readError = null;
  let writeError = null;

  return {
    getItem(key) {
      if (readError) {
        throw readError;
      }

      return entries.has(key) ? entries.get(key) : null;
    },
    setItem(key, value) {
      if (writeError) {
        throw writeError;
      }

      entries.set(key, String(value));
    },
    removeItem(key) {
      entries.delete(key);
    },
    setReadError(error) {
      readError = error;
    },
    setWriteError(error) {
      writeError = error;
    },
  };
}
