import React from "react";
import { act } from "react-dom/test-utils";
import VirtualTable from "../VirtualTable";
// import { render } from "@testing-library/react";
import { render} from '../../Test.helpers/test-utils'; // custom render that wraps with themeprovider

describe("<VirtualTable/> component", () => {
  it("renders the table", () => {
    var container;
    var mockUpdate = jest.fn();
    var mockConfigUpdate = jest.fn();
    var data = [];
    const mockConfig = {tableActions : jest.fn(), rowStyle: jest.fn(), cellComponent: jest.fn()};
    mockConfig.tableActions.mockReturnValue([]);

    const comp = {
      data: {
        subItems: [
          { width: 100, name: "select" },
          { width: 200, name: "checkbox" },
        ],
      },
    };
    act(() => {
      container = render(
          <VirtualTable
            setup={comp.data}
            pageData={data}
            configUpdate={mockConfigUpdate}
            updatePageData={mockUpdate}
            config={mockConfig}
          />
      ).container;
    });
    expect(container.querySelector(".ReactVirtualized__Table")).toBeTruthy();
  });
});
