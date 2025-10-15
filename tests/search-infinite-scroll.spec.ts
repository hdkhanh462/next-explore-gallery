import { expect, test } from "@playwright/test";

test.describe("Search and Infinite Scroll", () => {
  test("should search images have one result", async ({ page }) => {
    // Go to homepage
    await page.goto("/");

    // Wait for initial images to load
    await page.waitForSelector('[data-testid="image-feed"] > div');
    const initialImages = await page
      .locator('[data-testid="image-feed"] > div')
      .count();

    // Assert initial images are loaded
    console.log("Initial images count:", initialImages);
    expect(initialImages).toBeGreaterThan(0);

    // Fill search input that yields one result
    await page.locator('input[placeholder="Search images..."]').fill("12");
    await page.waitForTimeout(300); // Wait for debounce

    // Wait for search results to load
    await page.waitForSelector('[data-testid="image-feed"] > div');
    const searchImages = await page
      .locator('[data-testid="image-feed"] > div')
      .count();

    // Assert only one image is shown for query "12"
    console.log("Search images count:", searchImages);
    expect(searchImages).toEqual(1);
  });

  test("should search images have no result", async ({ page }) => {
    // Go to homepage
    await page.goto("/");

    // Wait for initial images to load
    await page.waitForSelector('[data-testid="image-feed"] > div');
    const initialImages = await page
      .locator('[data-testid="image-feed"] > div')
      .count();

    // Assert initial images are loaded
    console.log("Initial images count:", initialImages);
    expect(initialImages).toBeGreaterThan(0);

    // Fill search input with a query that yields no results
    await page
      .locator('input[placeholder="Search images..."]')
      .fill("nonexistentquery");
    await page.waitForTimeout(300); // Wait for debounce

    // Assert "No more images" message is shown
    await expect(page.getByText("No more images")).toBeVisible();
  });

  test("should load more images on scroll", async ({ page }) => {
    // Go to homepage
    await page.goto("/");

    // Wait for initial images to load
    await page.waitForSelector('[data-testid="image-feed"] > div');
    const initialImages = await page
      .locator('[data-testid="image-feed"] > div')
      .count();

    // Assert initial images are loaded
    console.log("Initial images count:", initialImages);
    expect(initialImages).toBeGreaterThan(0);

    // Scroll to bottom to trigger more images
    page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    // Wait for "Loading more..." text to appear
    await expect(page.locator("text=Loading more...")).toBeVisible();

    // Wait for more images to load
    await expect(page.locator("text=Loading more...")).toBeHidden();
    const moreImages = await page
      .locator('[data-testid="image-feed"] > div')
      .count();

    // Assert more images are loaded
    console.log("More images count:", moreImages);
    expect(moreImages).toBeGreaterThan(initialImages);
  });
});
