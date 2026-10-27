import assert from "node:assert/strict";
import test from "node:test";
import { createTaskStorage } from "../src/task-storage.mjs";
import { createFakeStorage } from "./helpers/fake-storage.mjs";

const task = {
  id: "task-1",
  title: "Prepare report",
  description: "Review figures",
  status: "Pending",
};

test("saved tasks can be loaded again with all fields intact", () => {
  const storage = createFakeStorage();
  const taskStorage = createTaskStorage(storage);

  taskStorage.saveTasks([task]);

  assert.deepEqual(taskStorage.loadTasks(), [task]);
});

test("an absent task collection loads as an empty collection", () => {
  assert.deepEqual(createTaskStorage(createFakeStorage()).loadTasks(), []);
});

test("malformed or invalid saved task data is reported", () => {
  const malformedJson = createFakeStorage({ "curso-pswe-07.tasks": "{" });
  const invalidTask = createFakeStorage({
    "curso-pswe-07.tasks": JSON.stringify([{ ...task, status: "Finished" }]),
  });

  assert.throws(() => createTaskStorage(malformedJson).loadTasks(), /saved task data/i);
  assert.throws(() => createTaskStorage(invalidTask).loadTasks(), /saved task data/i);
});

test("storage read and write failures are surfaced", () => {
  const readFailure = createFakeStorage();
  readFailure.setReadError(new Error("blocked"));

  const writeFailure = createFakeStorage();
  writeFailure.setWriteError(new Error("quota"));

  assert.throws(() => createTaskStorage(readFailure).loadTasks(), /read tasks/i);
  assert.throws(
    () => createTaskStorage(writeFailure).saveTasks([task]),
    /save tasks/i,
  );
});
