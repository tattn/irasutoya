import "jest";
import * as irasutoya from "../src/irasutoya";

test("randomImage", async () => {
  const detailImage = await irasutoya.randomImage();
  expect(detailImage.title).not.toBe("");
  expect(detailImage.imageUrl).not.toBe("");
  expect(detailImage.description).not.toBe("");
  expect(detailImage.categories).not.toBe("");
});

test("totalImageCount", async () => {
  const count = await irasutoya.totalImageCount();
  expect(count).toBeGreaterThan(10000);
});
