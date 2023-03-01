import React from "react";
import { act } from "react-dom/test-utils";
import TableConfigure from "../TableConfigure";
import { screen } from "@testing-library/react";
import { WIZARD_STATE } from "../../_components/wizardState";
import InitialState from "../../_context/types/initialState";
import { useSelectors } from "../../_context/selectors/useSelectors";
import { StoreContext } from "../../_context/Store";
import { StoreContextState } from "../../_context/types/StoreContextState";
import { ITechControlTable } from "../../Model/iTechRestApi/ITechControlTable";
import { resultsService } from "../../_services/resultsService";
import { caseService } from "../../_services/caseService";
import { render} from '../../Test.helpers/test-utils'; // custom render that wraps with themeprovider

describe("<TableConfigure/> component", () => {
  it("renders the data source when state is configure grid", async () => {
    await act(async () => {
      const { tableServiceMock, resultsServiceMock, caseServiceMock, updateDataMock } =
        mockServices();

      const testState: StoreContextState = {
        ...InitialState,
        ...{
          dataSources: [ // Need this in the mock store as dispatch in the useDatasources effect wont set it.
            {
              iTechControlColumns: [{ rowId: 222 }],
              icon: "Weekend",
              description: "desc",
              rowId: 123,
              name: "datasource",
            } as unknown as ITechControlTable,
          ],
        },
      };

      const selectors = useSelectors(testState);
      render(
        <StoreContext.Provider value={{ state: testState, selectors, dispatch: jest.fn }}>
          <TableConfigure
            wizardState={WIZARD_STATE.CONFIGURE_GRID}
            tableService={tableServiceMock}
            data={null}
            resultsService={resultsServiceMock}
            caseService={caseServiceMock}
            updateComponent={updateDataMock}
            updateData={updateDataMock}
          />
        </StoreContext.Provider>
      );

      expect(await screen.getByText("Choose data source")).toBeTruthy();
    });
  });

  it("renders the column selection when state is configure columns", async () => {
    const data = {
      data: {
        description: "File",
        icon: "ArtTrack",
        rowId: 0,
        id: "0-parent",
        subItems: [
          {
            types: null,
            advancedFilterSelected: true,
            dateArchived: null,
            dateInserted: null,
            dateModified: null,
            description: "ID",
            gridIndex: 0,
            gridSelected: true,
            guid: null,
            helperText: "Number",
            iTechControlColumnTypeRowId: 5,
            iTechControlTableRowId: 0,
            minWidth: 50,
            name: "rowId",
            notes: null,
            rowId: 0,
            signature: null,
            status: null,
            treeIndex: 19,
            treeSelected: null,
            id: "0-child",
            index: 0,
            checked: true,
          },
        ],
      },
    };
    await act(async () => {
      const { tableServiceMock, resultsServiceMock, caseServiceMock, updateDataMock } =
        mockServices();
      render(
        <TableConfigure
          wizardState={WIZARD_STATE.CONFIGURE_COLUMNS}
          tableService={tableServiceMock}
          data={data}
          resultsService={resultsServiceMock}
          caseService={caseServiceMock}
          updateComponent={updateDataMock}
          updateData={updateDataMock}
        />
      );
    });

    expect(await screen.getByText("Configure Table")).toBeTruthy();
  });

  it("renders an error when no wizard state", async () => {
    await act(async () => {
      const { tableServiceMock, resultsServiceMock, caseServiceMock, updateDataMock } =
        mockServices();

      render(
        <TableConfigure
          wizardState={""}
          tableService={tableServiceMock}
          data={null}
          resultsService={resultsServiceMock}
          caseService={caseServiceMock}
          updateComponent={updateDataMock}
          updateData={updateDataMock}
        />
      );
    });

    expect(await screen.getByText("Error in TableConfigure")).toBeTruthy();
  });
});

function mockServices() {
  const tableServiceMock = {
    getAll: jest.fn(
      () =>
        new Promise<ITechControlTable[]>((resolve) =>
          resolve([
            {
              iTechControlColumns: [{ rowId: 222 }],
              icon: "Weekend",
              description: "desc",
              rowId: 123,
              name: "datasource",
            } as unknown as ITechControlTable,
          ])
        )
    ),
    name: jest.fn(),
  };
  const resultsServiceMock = {
    getAll: jest.fn(
      () =>
        new Promise((resolve) =>
          resolve([{ name: "result 1", rowId: 10, forename: "john", surname: "doe" }])
        )
    ),
  } as unknown as typeof resultsService;
  const caseServiceMock = {
    getAll: jest.fn(
      () =>
        new Promise((resolve) =>
          resolve([{ name: "case 1", rowId: 1, forename: "alex", surname: "test" }])
        )
    ),
  } as unknown as typeof caseService;
  const updateDataMock = jest.fn();

  return { tableServiceMock, resultsServiceMock, caseServiceMock, updateDataMock };
}
