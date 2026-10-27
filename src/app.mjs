import {
  createTask,
  deleteTask,
  filterTasks,
  findTask,
  toggleTaskStatus,
  updateTask,
} from "./task-service.mjs";
import { createTaskStorage } from "./task-storage.mjs";

const app = document.querySelector("#app");
let tasks = [];
let selectedTaskId = null;
let screen = "list";
let activeFilter = "All";
let storage = null;
let storageError = "";
let storageLoadFailed = false;
let titleError = "";

try {
  storage = createTaskStorage();
  tasks = storage.loadTasks();
} catch (error) {
  storageError = error.message;
  storageLoadFailed = true;
}

function element(tagName, text, className) {
  const node = document.createElement(tagName);
  if (text !== undefined) {
    node.textContent = text;
  }
  if (className) {
    node.className = className;
  }
  return node;
}

function button(text, className, onClick, options = {}) {
  const node = element("button", text, className);
  node.type = "button";
  if (options.label) {
    node.setAttribute("aria-label", options.label);
  }
  node.addEventListener("click", onClick);
  return node;
}

function showStorageError(parent) {
  if (storageError) {
    parent.append(element("p", storageError, "error-message"));
  }
}

function saveTasks(nextTasks) {
  try {
    storage.saveTasks(nextTasks);
    tasks = nextTasks;
    storageError = "";
    return true;
  } catch (error) {
    storageError = error.message;
    return false;
  }
}

function renderList() {
  const header = element("header", undefined, "screen-header");
  header.append(element("h1", "Curso-PSWE-07"));
  header.append(
    button(
      "Add task",
      "primary-button",
      () => {
        titleError = "";
        screen = "add";
        render();
      },
    ),
  );
  if (storageLoadFailed) {
    header.querySelector("button").disabled = true;
  }
  app.append(header);
  showStorageError(app);

  if (storageLoadFailed) {
    return;
  }

  const filters = element("nav", undefined, "filter-bar");
  filters.setAttribute("aria-label", "Filter tasks");
  for (const filter of ["All", "Pending", "Done"]) {
    const filterButton = button(
      filter,
      "filter-button",
      () => {
        activeFilter = filter;
        render();
      },
    );
    filterButton.setAttribute("aria-pressed", String(activeFilter === filter));
    filters.append(filterButton);
  }
  app.append(filters);

  const visibleTasks = filterTasks(tasks, activeFilter);
  if (visibleTasks.length === 0) {
    app.append(
      element(
        "p",
        activeFilter === "All"
          ? "No tasks yet. Add one to get started."
          : "No matching tasks. Try another filter.",
        "empty-state",
      ),
    );
    return;
  }

  const list = element("section", undefined, "task-list");
  list.setAttribute("aria-label", "Tasks");
  for (const task of visibleTasks) {
    const row = button(
      "",
      "task-row",
      () => {
        selectedTaskId = task.id;
        screen = "detail";
        render();
      },
      { label: `${task.status} ${task.title}` },
    );
    row.append(
      element(
        "span",
        task.title,
        task.status === "Done" ? "task-title is-done" : "task-title",
      ),
      element("span", task.status, "task-status"),
    );
    list.append(row);
  }
  app.append(list);
}

function renderDetail() {
  const task = findTask(tasks, selectedTaskId);
  if (!task) {
    screen = "list";
    renderList();
    return;
  }

  showStorageError(app);
  const view = element("section", undefined, "detail-view");
  const heading = element("div", undefined, "detail-heading");
  heading.append(
    button(
      "Back",
      "back-button",
      () => {
        screen = "list";
        render();
      },
      { label: "Back to tasks" },
    ),
    element("h1", task.title),
  );
  view.append(heading);
  view.append(
    element(
      "p",
      task.description || "No description",
      "detail-description",
    ),
    element("p", task.status, "status-label"),
  );
  const actions = element("div", undefined, "detail-actions");
  actions.append(
    button("Edit", "secondary-button", () => {
      titleError = "";
      screen = "edit";
      render();
    }),
    button(
      task.status === "Pending" ? "Mark as done" : "Mark as not done",
      "status-button",
      () => {
        try {
          saveTasks(toggleTaskStatus(tasks, task.id));
          render();
        } catch (error) {
          storageError = error.message;
          render();
        }
      },
    ),
    button(
      "Delete",
      "danger-button",
      () => {
        if (!globalThis.confirm("Delete this task?")) {
          return;
        }
        try {
          if (saveTasks(deleteTask(tasks, task.id))) {
            selectedTaskId = null;
            screen = "list";
          }
          render();
        } catch (error) {
          storageError = error.message;
          render();
        }
      },
    ),
  );
  view.append(actions);
  app.append(view);
}

function renderForm() {
  const editing = screen === "edit";
  const currentTask = editing ? findTask(tasks, selectedTaskId) : null;
  if (editing && !currentTask) {
    screen = "list";
    renderList();
    return;
  }

  showStorageError(app);
  const heading = element("div", undefined, "detail-heading");
  heading.append(
    button(
      "Back",
      "back-button",
      () => {
        screen = editing ? "detail" : "list";
        titleError = "";
        render();
      },
      { label: editing ? "Cancel editing" : "Back to tasks" },
    ),
    element("h1", editing ? "Edit task" : "Add task"),
  );
  app.append(heading);

  const form = element("form", undefined, "task-form");
  const titleLabel = element("label", "Title");
  const titleInput = element("input");
  titleInput.id = "task-title";
  titleInput.name = "title";
  titleInput.required = true;
  titleInput.value = currentTask?.title ?? "";
  titleLabel.htmlFor = titleInput.id;
  titleLabel.append(titleInput);

  const descriptionLabel = element("label", "Description");
  const descriptionInput = element("textarea");
  descriptionInput.id = "task-description";
  descriptionInput.name = "description";
  descriptionInput.value = currentTask?.description ?? "";
  descriptionLabel.htmlFor = descriptionInput.id;
  descriptionLabel.append(descriptionInput);

  form.append(titleLabel, descriptionLabel);
  if (titleError) {
    const message = element("p", titleError, "validation-message");
    message.setAttribute("role", "alert");
    form.append(message);
    titleInput.setAttribute("aria-invalid", "true");
    titleInput.setAttribute("aria-describedby", "title-error");
    message.id = "title-error";
  }

  const actions = element("div", undefined, "form-actions");
  const saveButton = element("button", "Save", "primary-button");
  saveButton.type = "submit";
  const cancelButton = button(
    "Cancel",
    "secondary-button",
    () => {
      screen = editing ? "detail" : "list";
      titleError = "";
      render();
    },
  );
  actions.append(saveButton, cancelButton);
  form.append(actions);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    titleError = "";
    try {
      if (editing) {
        if (saveTasks(updateTask(tasks, selectedTaskId, {
          title: titleInput.value,
          description: descriptionInput.value,
        }))) {
          screen = "detail";
        }
      } else {
        const newTask = createTask({
          title: titleInput.value,
          description: descriptionInput.value,
        });
        if (saveTasks([...tasks, newTask])) {
          screen = "list";
        }
      }
      render();
    } catch (error) {
      if (error.message.includes("title")) {
        titleError = "A title is required.";
      } else {
        storageError = error.message;
      }
      render();
      if (titleError) {
        app.querySelector("#task-title")?.focus();
      }
    }
  });
  app.append(form);
}

function render() {
  app.replaceChildren();
  if (screen === "list") {
    renderList();
  } else if (screen === "detail") {
    renderDetail();
  } else {
    renderForm();
  }
}

render();
