import "mocha";
import * as assert from "power-assert";
import * as irasutoya from "../src/irasutoya";

describe("IrasutoyaTest", () => {
  it("randomImage", async () => {
    const detailImage = await irasutoya.randomImage();
    assert.notEqual(detailImage.title, "");
    assert.notEqual(detailImage.imageUrl, "");
    assert.notEqual(detailImage.description, "");
    assert.notEqual(detailImage.categories, []);
  });
});
