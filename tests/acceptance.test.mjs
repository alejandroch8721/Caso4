import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { chromium } from "playwright";
import { startTestServer } from "./helpers/test-server.mjs";

let browser;
let server;

before(async () => {
  server = await startTestServer();
  browser = await chromium.launch({ headless: true });
});

after(async () => {
  await browser.close();
  await server.close();
});

async function openFreshPage(initialTasks = []) {
  const context = await browser.newContext();
  await context.addInitScript((tasks) => {
    if (tasks.length > 0 && sessionStorage.getItem("test-seeded") !== "true") {
      localStorage.setItem("curso-pswe-07.tasks", JSON.stringify(tasks));
      sessionStorage.setItem("test-seeded", "true");
    }
  }, initialTasks);
  const page = await context.newPage();
  page.setDefaultTimeout(2_000);
  page.setDefaultNavigationTimeout(2_000);
  await page.goto(server.origin);
  return { context, page };
}

test("the list identifies the app and offers the empty state and add action", async () => {
  const { context, page } = await openFreshPage();

  try {
    assert.equal(await page.title(), "Curso-PSWE-07");
    await page.getByRole("heading", { name: "Curso-PSWE-07" }).waitFor();
    await page.getByText(/no tasks yet/i).waitFor();

    const addButton = page.getByRole("button", { name: "Add task" });
    const bounds = await addButton.boundingBox();
    assert.ok(bounds, "Add task action should be visible");
    assert.ok(bounds.width >= 44 && bounds.height >= 44, "Add task target should be at least 44 by 44 pixels");
  } finally {
    await context.close();
  }
});

test("visual styling stays readable and usable at mobile and desktop sizes", async () => {
  const { context, page } = await openFreshPage([
    { id: "done-visual", title: "Completed task", description: "Task description", status: "Done" },
  ]);
  const assertTargetSize = async (locator) => {
    const bounds = await locator.boundingBox();
    assert.ok(bounds, "Target should be visible");
    assert.ok(bounds.width >= 44 && bounds.height >= 44, "Target should be at least 44 by 44 pixels");
  };
  const contrastRatio = (foreground, background) => {
    const luminance = (color) => {
      const channels = color.match(/[\d.]+/g).slice(0, 3).map(Number);
      const linear = channels.map((channel) => {
        const normalized = channel / 255;
        return normalized <= 0.04045
          ? normalized / 12.92
          : ((normalized + 0.055) / 1.055) ** 2.4;
      });
      return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
    };
    const first = luminance(foreground);
    const second = luminance(background);
    return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
  };

  try {
    await page.setViewportSize({ width: 375, height: 812 });
    const fontFamily = await page.locator("body").evaluate((node) => getComputedStyle(node).fontFamily);
    assert.match(fontFamily, /sans-serif/i);

    const addButton = page.getByRole("button", { name: "Add task" });
    const activeFilter = page.getByRole("button", { name: "All", exact: true });
    const taskRow = page.getByRole("button", { name: "Done Completed task", exact: true });
    await assertTargetSize(addButton);
    await assertTargetSize(activeFilter);
    await assertTargetSize(taskRow);

    const listStyles = await page.evaluate(() => {
      const add = document.querySelector(".primary-button");
      const filter = document.querySelector('.filter-button[aria-pressed="true"]');
      const title = document.querySelector(".task-title");
      const row = title.parentElement;
      return {
        addBackground: getComputedStyle(add).backgroundColor,
        filterBackground: getComputedStyle(filter).backgroundColor,
        titleColor: getComputedStyle(title).color,
        baseTextColor: getComputedStyle(document.body).color,
        titleBackground: getComputedStyle(row).backgroundColor,
        titleDecoration: getComputedStyle(title).textDecorationLine,
        titleWeight: Number(getComputedStyle(title).fontWeight),
        bodyBackground: getComputedStyle(document.body).backgroundColor,
      };
    });
    assert.equal(listStyles.addBackground, listStyles.filterBackground);
    assert.notEqual(listStyles.titleColor, listStyles.baseTextColor);
    assert.match(listStyles.titleDecoration, /line-through/);
    assert.ok(contrastRatio(listStyles.titleColor, listStyles.titleBackground) >= 4.5);

    await taskRow.click();
    const detailStyles = await page.evaluate(() => {
      const title = document.querySelector(".detail-heading h1");
      const description = document.querySelector(".detail-description");
      return {
        titleSize: Number.parseFloat(getComputedStyle(title).fontSize),
        titleWeight: Number(getComputedStyle(title).fontWeight),
        descriptionSize: Number.parseFloat(getComputedStyle(description).fontSize),
        descriptionColor: getComputedStyle(description).color,
        background: getComputedStyle(document.body).backgroundColor,
      };
    });
    assert.ok(detailStyles.titleSize > detailStyles.descriptionSize);
    assert.ok(detailStyles.titleWeight > 400);
    assert.ok(contrastRatio(detailStyles.descriptionColor, detailStyles.background) >= 4.5);
    for (const name of ["Edit", "Mark as not done", "Delete"]) {
      await assertTargetSize(page.getByRole("button", { name }));
    }

    await page.getByRole("button", { name: "Edit" }).click();
    await assertTargetSize(page.getByLabel("Title"));
    await assertTargetSize(page.getByLabel("Description"));
    await assertTargetSize(page.getByRole("button", { name: "Save" }));
    await assertTargetSize(page.getByRole("button", { name: "Cancel", exact: true }));

    for (const width of [375, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      const dimensions = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        content: document.documentElement.scrollWidth,
      }));
      assert.ok(dimensions.content <= dimensions.viewport, `No horizontal overflow at ${width}px`);
    }
  } finally {
    await context.close();
  }
});

test("a task can be created, opened, and retained after reloading", async () => {
  const { context, page } = await openFreshPage();

  try {
    await page.getByRole("button", { name: "Add task" }).click();
    await page.getByLabel("Title").fill("Prepare report");
    await page.getByLabel("Description").fill("Review the latest figures");
    await page.getByRole("button", { name: "Save" }).click();

    await page.getByRole("button", { name: /Prepare report/ }).click();
    await page.getByRole("heading", { name: "Prepare report" }).waitFor();
    await page.getByText("Review the latest figures").waitFor();

    await page.reload();
    await page.getByRole("button", { name: /Prepare report/ }).waitFor();
    await page.getByRole("button", { name: /Prepare report/ }).click();
    await page.getByText("Review the latest figures").waitFor();
    await page.getByText("Pending", { exact: true }).waitFor();
  } finally {
    await context.close();
  }
});

test("a task without a description shows the muted placeholder", async () => {
  const { context, page } = await openFreshPage([
    { id: "no-description", title: "Short task", description: "", status: "Pending" },
  ]);

  try {
    await page.getByRole("button", { name: /Short task/ }).click();
    const placeholder = page.getByText("No description", { exact: true });
    await placeholder.waitFor();
    assert.equal(
      await placeholder.evaluate((node) => getComputedStyle(node).color),
      "rgb(71, 84, 103)",
    );
  } finally {
    await context.close();
  }
});

test("a blank task title is rejected with a validation message", async () => {
  const { context, page } = await openFreshPage();

  try {
    await page.getByRole("button", { name: "Add task" }).click();
    await page.getByLabel("Title").fill("   ");
    await page.getByRole("button", { name: "Save" }).click();
    await page.getByRole("alert").waitFor();
    await page.getByLabel("Title").waitFor();
  } finally {
    await context.close();
  }
});

test("status filters show matching tasks and identify the active option", async () => {
  const { context, page } = await openFreshPage([
    { id: "pending-1", title: "Pending item", description: "", status: "Pending" },
    { id: "done-1", title: "Completed item", description: "", status: "Done" },
  ]);

  try {
    await page.getByRole("button", { name: "All", exact: true }).waitFor();
    await page.getByRole("button", { name: "Pending", exact: true }).click();
    await page.getByRole("button", { name: /Pending item/ }).waitFor();
    await page.getByRole("button", { name: /Completed item/ }).waitFor({ state: "hidden" });
    assert.equal(
      await page
        .getByRole("button", { name: "Pending", exact: true })
        .getAttribute("aria-pressed"),
      "true",
    );

    await page.getByRole("button", { name: "Done", exact: true }).click();
    await page.getByRole("button", { name: /Completed item/ }).waitFor();
    await page.getByRole("button", { name: /Pending item/ }).waitFor({ state: "hidden" });

    await page.getByRole("button", { name: "All", exact: true }).click();
    await page.getByRole("button", { name: /Pending item/ }).waitFor();
    await page.getByRole("button", { name: /Completed item/ }).waitFor();
  } finally {
    await context.close();
  }
});

test("a status filter with no matching tasks shows an empty state", async () => {
  const { context, page } = await openFreshPage();

  try {
    await page.getByRole("button", { name: "Done", exact: true }).click();
    await page.getByText(/no matching tasks/i).waitFor();
  } finally {
    await context.close();
  }
});

test("tasks can be edited, toggled, and deleted only after confirmation", async () => {
  const { context, page } = await openFreshPage([
    { id: "task-1", title: "Original title", description: "Original description", status: "Pending" },
  ]);

  try {
    await page.getByRole("button", { name: /Original title/ }).click();
    await page.getByRole("button", { name: "Edit" }).click();
    await page.getByLabel("Title").fill(" ");
    await page.getByRole("button", { name: "Save" }).click();
    await page.getByRole("alert").waitFor();
    await page.getByLabel("Title").fill("Unsaved title");
    await page.getByRole("button", { name: "Cancel", exact: true }).click();
    await page.getByRole("heading", { name: "Original title" }).waitFor();

    await page.getByRole("button", { name: "Edit" }).click();
    await page.getByLabel("Title").fill("Updated title");
    await page.getByLabel("Description").fill("Updated description");
    await page.getByRole("button", { name: "Save" }).click();
    await page.getByRole("heading", { name: "Updated title" }).waitFor();
    await page.getByText("Updated description").waitFor();

    await page.getByRole("button", { name: "Mark as done" }).click();
    await page.getByText("Done", { exact: true }).waitFor();
    await page.getByRole("button", { name: "Mark as not done" }).click();
    await page.getByText("Pending", { exact: true }).waitFor();

    let dialogMessage = "";
    page.once("dialog", async (dialog) => {
      dialogMessage = dialog.message();
      await dialog.dismiss();
    });
    await page.getByRole("button", { name: "Delete" }).click();
    assert.match(dialogMessage, /delete/i);
    await page.getByRole("heading", { name: "Updated title" }).waitFor();

    page.once("dialog", async (dialog) => {
      await dialog.accept();
    });
    await page.getByRole("button", { name: "Delete" }).click();
    await page.getByText(/no tasks yet/i).waitFor();
    await page.reload();
    await page.getByText(/no tasks yet/i).waitFor();
  } finally {
    await context.close();
  }
});
