import React from "react";
import { act } from "react-dom/test-utils";
import Properties from "../Properties";
import { screen } from "@testing-library/react";
import { StoreContext } from "../../_context/Store";
import { ITechControlTable } from "../../Model/iTechRestApi/ITechControlTable";
import { ITechControlColumn } from "../../Model/iTechRestApi/ITechControlColumn";
import { PageDataType, StoreContextState } from "../../_context/types/StoreContextState";
import InitialState from "../../_context/types/initialState";
import { useSelectors } from "../../_context/selectors/useSelectors";
import SelectedGridRowType from "../../Model/Types/selectedGridRowType";
import { ITechDataWebMenuExtended } from "../../Model/Extended/ITechDataWebMenuExtended";
import { render} from '../../Test.helpers/test-utils'; // custom render that wraps with themeprovider

describe("<Properties/> component", () => {
  it("renders the properties listdisplay", async () => {
    // selected row data
    const selected = {
      id: "1",
      gid: "1",
      datasource: "datasource",
      from: "from property text",
    } as unknown as SelectedGridRowType;

    const dataSource = {
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
      name: "datasource",
      iTechControlDatabaseSchemaTypeRowId: null,
    } as ITechControlTable;

    const mockTableService = {
      name: jest.fn(() =>
        Promise.resolve(dataSource)
      ),
      getAll: jest.fn(() => Promise.resolve([] as ITechControlTable[])),
    };

    const selectedTabId = 1;
    const testState: StoreContextState = {
      ...InitialState,
      ...{
        menuList: [
          {
            selected: true,
            rowId: 1,
            iTechDataWebTabs: [{ selected: true, rowId: selectedTabId }],
          },
        ] as ITechDataWebMenuExtended[],
        dataSources: [ // Need this in the mock store as dispatch in the useDatasources effect wont set it.
          dataSource
        ],
      },
    };

    testState.pageData?.set(selectedTabId, {
      ...testState.pageData?.get(selectedTabId),
      data: selected,
      selectedVersion: undefined,
    } as PageDataType);

    const selectors = useSelectors(testState);

    await act(async () => {
      render(
        <StoreContext.Provider value={{ state: testState, selectors, dispatch: jest.fn }}>
          <Properties tableService={mockTableService} />
        </StoreContext.Provider>
      );
    });
    expect(screen.getByText("from property text")).toBeTruthy();
  });
});
