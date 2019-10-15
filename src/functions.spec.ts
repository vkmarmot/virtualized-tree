import {flatTree} from "./functions";

describe("functions", () => {
  test("flatTree", () => {
    expect(flatTree([
      {
        children: [
          {
            id: "foo"
          }
        ],
        id: "bar"
      },
      {
        id: "baz"
      }
    ])).toEqual([
      {
        id: "bar",
        offset: 0
      },
      {
        id: "foo",
        offset: 1
      },
      {
        id: "baz",
        offset: 0
      }
    ])
  })
})
