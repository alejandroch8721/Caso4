const storageKey = "curso-pswe-07.tasks";
const allowedStatuses = new Set(["Pending", "Done"]);

export function createTaskStorage(storage = globalThis.localStorage) {
  if (!storage) {
    throw new Error("Browser task storage is unavailable.");
  }

  return {
    loadTasks() {
      let serialized;
      try {
        serialized = storage.getItem(storageKey);
      } catch (cause) {
        throw new Error("Unable to read tasks from browser storage.", { cause });
      }

      if (serialized === null) {
        return [];
      }

      try {
        const tasks = JSON.parse(serialized);
        validateTaskCollection(tasks);
        return tasks;
      } catch (cause) {
        throw new Error("Invalid saved task data; the saved collection could not be loaded.", {
          cause,
        });
      }
    },

    saveTasks(tasks) {
      try {
        validateTaskCollection(tasks);
        storage.setItem(storageKey, JSON.stringify(tasks));
      } catch (cause) {
        if (cause instanceof TypeError && cause.message.startsWith("Invalid task")) {
          throw cause;
        }
        throw new Error("Unable to save tasks to browser storage.", { cause });
      }
    },
  };
}

function validateTaskCollection(tasks) {
  if (!Array.isArray(tasks)) {
    throw new TypeError("Invalid task collection.");
  }

  const identifiers = new Set();
  for (const task of tasks) {
    if (
      !task ||
      typeof task.id !== "string" ||
      task.id.length === 0 ||
      identifiers.has(task.id) ||
      typeof task.title !== "string" ||
      task.title.trim().length === 0 ||
      typeof task.description !== "string" ||
      !allowedStatuses.has(task.status)
    ) {
      throw new TypeError("Invalid task record.");
    }
    identifiers.add(task.id);
  }
}
