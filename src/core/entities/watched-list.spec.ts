import { describe, expect, it } from "vitest";
import { WatchedList } from "./watched-list";

class NumberWatchedList extends WatchedList<number> {
  compareItems(a: number, b: number): boolean {
    return a === b;
  }
}

describe("Number Watched List", () => {
  it("should be able to create a watched list with initial items", () => {
    const items = new NumberWatchedList([1, 2, 3]);

    expect(items.currentItems).toHaveLength(3);
  });

  it("should be to add new items to the list", () => {
    const items = new NumberWatchedList([1, 2, 3]);
    items.add(4);

    expect(items.currentItems).toHaveLength(4);
    expect(items.getNewItems()).toEqual([4]);
  });

  it("should be able to remove items from a list", () => {
    const items = new NumberWatchedList([1, 2, 3]);
    items.remove(2);

    expect(items.currentItems).toHaveLength(2);
    expect(items.getRemovedItems()).toEqual([2]);
  });

  it("should be able to add an item even if it was removed before", () => {
    const items = new NumberWatchedList([1, 2, 3]);
    items.remove(2);
    items.add(2);

    expect(items.currentItems).toHaveLength(3);
    expect(items.getRemovedItems()).toEqual([]);
    expect(items.getNewItems()).toEqual([]);
  });

  it("should be able to remove an item even if it was added before", () => {
    const items = new NumberWatchedList([1, 2, 3]);
    items.add(4);
    items.remove(4);

    expect(items.currentItems).toHaveLength(3);
    expect(items.getNewItems()).toEqual([]);
    expect(items.getRemovedItems()).toEqual([]);
  });

  it("should be able to update watched list items", () => {
    const items = new NumberWatchedList([1, 2, 3]);
    items.update([1, 3, 5]);

    expect(items.currentItems).toHaveLength(3);
    expect(items.getNewItems()).toEqual([5]);
    expect(items.getRemovedItems()).toEqual([2]);
  });
});
