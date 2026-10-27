import assert from "node:assert/strict";
import test from "node:test";
import {
  createTask,
  deleteTask,
  filterTasks,
  findTask,
  toggleTaskStatus,
  updateTask,
} from "../src/task-service.mjs";

test("createTask creates a Pending task with an optional description", () => {
  const task = createTask({ title: "Prepare report", description: "Review figures" });

  assert.equal(task.title, "Prepare report");
  assert.equal(task.description, "Review figures");
  assert.equal(task.status, "Pending");
  assert.ok(task.id);
});

test("createTask permits an omitted description", () => {
  assert.equal(createTask({ title: "Call supplier" }).description, "");
});

test("createTask rejects an empty or whitespace-only title", () => {
  for (const title of ["", "  \t\n"]) {
    assert.throws(() => createTask({ title }), /title/i);
  }
});

test("findTask returns the task with the requested identifier", () => {
  const task = createTask({ title: "Prepare report" });

  assert.equal(findTask([task], task.id), task);
  assert.equal(findTask([task], "missing-id"), undefined);
});

test("filterTasks returns all tasks or only the requested status", () => {
  const pending = { id: "1", status: "Pending" };
  const done = { id: "2", status: "Done" };

  assert.deepEqual(filterTasks([pending, done], "All"), [pending, done]);
  assert.deepEqual(filterTasks([pending, done], "Pending"), [pending]);
  assert.deepEqual(filterTasks([pending, done], "Done"), [done]);
  assert.throws(() => filterTasks([pending], "Unknown"), /filter/i);
});

test("updateTask changes validated title and description fields", () => {
  const task = createTask({ title: "Original", description: "Before" }, () => "task-1");

  assert.deepEqual(updateTask([task], task.id, { title: "Updated", description: "After" }), [
    { ...task, title: "Updated", description: "After" },
  ]);
  assert.throws(() => updateTask([task], task.id, { title: " " }), /title/i);
});

test("toggleTaskStatus switches between Pending and Done", () => {
  const pending = createTask({ title: "Task" }, () => "task-1");
  const done = { ...pending, status: "Done" };

  assert.deepEqual(toggleTaskStatus([pending], pending.id), [done]);
  assert.deepEqual(toggleTaskStatus([done], done.id), [pending]);
});

test("deleteTask removes only the requested task", () => {
  const first = createTask({ title: "First" }, () => "task-1");
  const second = createTask({ title: "Second" }, () => "task-2");

  assert.deepEqual(deleteTask([first, second], first.id), [second]);
});
