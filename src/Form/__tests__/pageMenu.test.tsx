import React from "react";
import { act } from "react-dom/test-utils";
import PageMenu from "../PageMenu";
// import { render } from "@testing-library/react";
import { render} from '../../Test.helpers/test-utils'; // custom render that wraps with themeprovider
import { ITechDataWebFolderExtended } from "../../Model/Extended/ITechDataWebFolderExtended";
import { menuService } from "../../_services/menuService";
import { iTechDataWebFolderEnum } from "../../Model/iTechRestApi/iTechDataWebFolderEnum";

describe("<PageMenu/> component", () => {
  it("renders the page menu", async () => {
    const _onFormClose = () => {};
    const _editMenu = (name: string, icon: string, folderId?: number) => Promise.resolve();

    const mockService = {
      getFolders: jest.fn(
        () =>
          new Promise<ITechDataWebFolderExtended[]>((resolve) =>
            resolve([
              {
                rowId: 123,
                path: "path",
              } as unknown as ITechDataWebFolderExtended,
            ])
          )
      ),
    } as unknown as typeof menuService;
    let container;
    const page = {
      rowId: 1,
      icon: "Weekend",
    };
    await act(async() => {
      container = render(
        <PageMenu
          currentPage={page}
          service={mockService}
          area={"area"}
          rootFolderTypes={[iTechDataWebFolderEnum.user, iTechDataWebFolderEnum.standard]}
          onClose={_onFormClose}
          onConfirm={_editMenu}
        />
      ).container;
    });
    expect(container.querySelector("button")).toBeTruthy();
  });
});
