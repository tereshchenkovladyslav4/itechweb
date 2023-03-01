import React from "react";
import { act } from "react-dom/test-utils";
import { TreeDisplay } from "../TreeDisplay";
import {  screen } from "@testing-library/react";
import { treeService } from "../../_services/treeService";
import { ResultSet } from "../../Model/iTechRestApi/ResultSet";
import { TreeNode } from "../../Model/iTechRestApi/TreeList";
import { render} from '../../Test.helpers/test-utils'; // custom render that wraps with themeprovider

let mockTreeService: typeof treeService;

describe("<TreeDisplay/> component", () => {
  beforeEach(() => {
    const result = new ResultSet<TreeNode>();
    result.results = [];
    mockTreeService = {
      get: jest.fn(() => Promise.resolve(result)),
    };
  });

  it("renders the tree display", () => {
    const comp = {
      data: [],
    };
    
    const {container} = render(
      <TreeDisplay config={comp} service={mockTreeService} area="a" />
    );

    expect(container.querySelector("div")).toBeTruthy();
  });

  it("renders the tree display root node with display name", async () => {
    const comp = {
      data: [
        {
          rowId: 1,
          description: "Archive",
          name: "iTechWebSim",
          subItems: [{ rowId: 2, description: "Item 1", index: 0, treeIndex: 1 }],
        },
      ],
    };
    await act(async () => {
      render(<TreeDisplay config={comp} service={mockTreeService} area="a" />);
    });
    const title = await screen.findByText(comp.data[0].description);
    expect(title).toBeTruthy();
  });
});
