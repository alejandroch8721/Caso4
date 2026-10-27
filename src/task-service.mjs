export function createTask({ title, description = "" }, createId = () => crypto.randomUUID()) {
  if (typeof title !== "string" || title.trim().length === 0) {
    throw new Error("A task title is required.");
  }
  if (typeof description !== "string") {
    throw new Error("A task description must be text.");
  }

  return {
    id: createId(),
    title,
    description,
    status: "Pending",
  };
}

export function findTask(tasks, id) {
  return tasks.find((task) => task.id === id);
}

export function filterTasks(tasks, filter) {
  if (!["All", "Pending", "Done"].includes(filter)) {
    throw new Error(`Unknown task filter: ${filter}`);
  }

  return filter === "All" ? [...tasks] : tasks.filter((task) => task.status === filter);
}

export function updateTask(tasks, id, changes) {
  const task = requireTask(tasks, id);
  const title = changes.title ?? task.title;
  const description = changes.description ?? task.description;

  if (typeof title !== "string" || title.trim().length === 0) {
    throw new Error("A task title is required.");
  }
  if (typeof description !== "string") {
    throw new Error("A task description must be text.");
  }

  return tasks.map((candidate) =>
    candidate.id === id ? { ...candidate, title, description } : candidate,
  );
}

export function toggleTaskStatus(tasks, id) {
  const task = requireTask(tasks, id);
  const status = task.status === "Pending" ? "Done" : "Pending";

  return tasks.map((candidate) => (candidate.id === id ? { ...candidate, status } : candidate));
}

export function deleteTask(tasks, id) {
  requireTask(tasks, id);
  return tasks.filter((task) => task.id !== id);
}

function requireTask(tasks, id) {
  const task = findTask(tasks, id);
  if (!task) {
    throw new Error(`Task not found: ${id}`);
  }
  return task;
}
