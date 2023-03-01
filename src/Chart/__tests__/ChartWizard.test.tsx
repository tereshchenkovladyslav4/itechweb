import React from "react";
import { act } from "react-dom/test-utils";
import { screen } from "@testing-library/react";
import CharWizard from "../ChartWizard";
import { Charts } from "../IFilteredChart";
import { StoreContext } from "../../_context/Store";
import InitialState from "../../_context/types/initialState";
import { useSelectors } from "../../_context/selectors/useSelectors";
import { StoreContextState } from "../../_context/types/StoreContextState";
import { ITechDataWebMenuExtended } from "../../Model/Extended/ITechDataWebMenuExtended";
import { ITechControlTable } from "../../Model/iTechRestApi/ITechControlTable";
import { ITechControlColumn } from "../../Model/iTechRestApi/ITechControlColumn";
import { render} from '../../Test.helpers/test-utils'; // custom render that wraps with themeprovider

const mockTableService = {
  name: jest.fn(() =>
    Promise.resolve({
      description: "file",
      iTechControlColumns: [
        {
          rowId: "2",
          description: "From",
          name: "from",
          gridIndex: "1",
        } as unknown as ITechControlColumn,
      ],
      icon: "Weekend",
      rowId: 1,
      dateArchived: null,
      dateInserted: null,
      dateModified: null,
      name: "test",
      iTechControlDatabaseSchemaTypeRowId: null,
    } as ITechControlTable)
  ),
  getAll: jest.fn(() => Promise.resolve([] as ITechControlTable[])),
};

describe("<CharWizard/> component", () => {
  it("renders the default chart wizard", () => {
    const chartsNotListed = [
      "Chart",
      "Stock Price",
      "Stock News Chart",
      "Stock Chart",
      "Case Relationships", // only when has caseId
      "Workflow", // only when has caseId
    ];

    const testState: StoreContextState = {
      ...InitialState,
      ...{
        // Need this in the mock store as dispatch in the useDatasources effect wont set it.
        dataSources: getMockDataSources(),
      },
    };
    const selectors = useSelectors(testState);

    act(() => {
      render(
        <StoreContext.Provider value={{ state: testState, selectors, dispatch: jest.fn }}>
          <CharWizard
            componentType={"Chart"}
            data={{}}
            area="abcd"
            updateData={jest.fn}
            tableService={mockTableService}
          />
        </StoreContext.Provider>
      );
    });

    expect(screen.getByText("Choose component")).toBeTruthy();
    Charts.filter((x) => !chartsNotListed.includes(x)).forEach((c) =>
      expect(screen.getAllByText(c)).toBeTruthy()
    );
  });

  it("renders the default chart wizard for a case", () => {
    // chart names as rendered
    const ChartsListed = [
      "Count of File Types",
      "Count of File Types by Month",
      "Files Collected Daily",
      "Top 5 user voice files",
      "Top 5 user sms files",
      "Top 5 user email files",
      "Timeline",
      "Case Relationships",
      "Workflow",
      "Case Status for last 31 days",
      "Case Status daily for last 31 days",
      "Case (open) Subtype daily for last 31 days",
      "Case (all) Subtype daily for last 31 days",
    ];

    const selectedTabId = 1;
    const testState: StoreContextState = {
      ...InitialState,
      ...{
        menuList: [
          {
            selected: true,
            rowId: 1,
            iTechDataWebTabs: [{ selected: true, rowId: selectedTabId, iTechDataCaseRowId: 1 }],
          },
        ] as ITechDataWebMenuExtended[],
        // Need this in the mock store as dispatch in the useDatasources effect wont set it.
        dataSources: getMockDataSources(),
      },
    };

    const selectors = useSelectors(testState);
    act(() => {
      render(
        <StoreContext.Provider value={{ state: testState, selectors, dispatch: jest.fn }}>
          <CharWizard
            componentType={"Chart"}
            data={{}}
            area="abcd"
            updateData={jest.fn}
            tableService={mockTableService}
          />
        </StoreContext.Provider>
      );
    });

    expect(screen.getByText("Choose component")).toBeTruthy();
    ChartsListed.forEach((c) => expect(screen.getByText(c)).toBeTruthy());
  });

  it("renders the chart wizard filtering out ITechWebSim sourced charts", () => {
    // chart names as rendered
    const ChartsListed = [
      "Workflow",
      "Case Status for last 31 days",
      "Case Status daily for last 31 days",
      "Case (open) Subtype daily for last 31 days",
      "Case (all) Subtype daily for last 31 days",
    ];

    const selectedTabId = 1;
    const testState: StoreContextState = {
      ...InitialState,
      ...{
        menuList: [
          {
            selected: true,
            rowId: 1,
            iTechDataWebTabs: [{ selected: true, rowId: selectedTabId, iTechDataCaseRowId: 1 }],
          },
        ] as ITechDataWebMenuExtended[],
        // Need this in the mock store as dispatch in the useDatasources effect wont set it.
        dataSources: getMockDataSources().filter((x) => x.name !== "iTechWebSim"),
      },
    };

    const selectors = useSelectors(testState);
    act(() => {
      render(
        <StoreContext.Provider value={{ state: testState, selectors, dispatch: jest.fn }}>
          <CharWizard
            componentType={"Chart"}
            data={{}}
            area="abcd"
            updateData={jest.fn}
            tableService={mockTableService}
          />
        </StoreContext.Provider>
      );
    });

    expect(screen.getByText("Choose component")).toBeTruthy();
    ChartsListed.forEach((c) => expect(screen.getByText(c)).toBeTruthy());
  });
});

const getMockDataSources = () =>
  [
    {
      name: "iTechWebSim",
    },
    {
      name: "iTechWebAudit",
    },
    {
      name: "iTechWebSimCaseFile",
    },
    {
      name: "iTechWebCaseManagement",
    },
    {
      name: "iTechWebTask",
    },
  ] as unknown as ITechControlTable[];
