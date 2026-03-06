import { expect, test } from "vitest";
import { Slug } from "./slug";

test("it should be able to create a new slug from text", () => {
  const slug = Slug.createFromText("Example question title");

  expect(slug.value).toEqual("example-question-title");
});

test("it should create a slug instance with a valid value", () => {
  const slug = Slug.create("an-example-title");

  expect(slug.value).toEqual("an-example-title");
});
