import React, { ReactElement } from "react";
import { treeService } from "../_services/treeService";
import { TreeDisplayRoot } from "./TreeDisplay";

interface IUserTreeProps {
  userButton: (node: any) => React.ReactNode;
  rootNode?: string;
}

// TODO: pull out actual table column info - rowIds cannot be fixed as below
const UserTree: React.FC<IUserTreeProps> = ({ userButton, rootNode }): ReactElement => {
  const _config = {
    componentType: "Tree Filter",
    data: [
      {
        rowId: 3,
        name: "iTechWebUser",
        iTechControlDatabaseSchemaTypeRowId: 9,
        description: rootNode ?? "Users",
        id: "3-parent-Tree",
        subItems: [
          {
            rowId: 682,
            iTechControlTableRowId: 3,
            iTechControlColumnTypeRowId: 17,
            name: "iTechDataUserMemberOfRowId",
            description: "Groups",
            id: "682-child-Tree",
            index: 0,
            checked: true,
          },
          {
            rowId: 860,
            iTechControlTableRowId: 3,
            iTechControlColumnTypeRowId: 14,
            name: "rowId",
            description: "Name",
            id: "860-child-Tree",
            index: 1,
            checked: true,
          },
        ],
        open: true,
      },
    ],
  };

  const _labelRender = (node: any): React.ReactNode => {
    return (
      <>
        {node.name} {userButton(node)}
      </>
    );
  };

  return (
    <TreeDisplayRoot
      config={_config}
      area="UserTree"
      service={treeService}
      labelRender={_labelRender}
    />
  );
};

export default UserTree;
