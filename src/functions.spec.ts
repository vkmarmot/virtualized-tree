import { flatTree } from "./functions";

describe("functions", () => {
  test("flatTree", () => {
    expect(
      flatTree([
        {
          children: [
            {
              collapsed: false,
              id: "foo"
            }
          ],
          collapsed: false,
          id: "bar"
        },
        {
          collapsed: false,
          id: "baz"
        }
      ])
    ).toEqual([
      {
        collapsed: false,
        id: "bar",
        offset: 0
      },
      {
        collapsed: false,
        id: "foo",
        offset: 1
      },
      {
        collapsed: false,
        id: "baz",
        offset: 0
      }
    ]);
  });
});
