import React, { ReactElement } from "react";
import List from "@mui/material/List";
import StaticMenuItem from "./StaticMenuItem";

type StaticMenuListProps = {
  addPageHandler: any;
  menuExpanded: any;
};

const StaticMenuList: React.FC<StaticMenuListProps> = ({
  addPageHandler,
  menuExpanded,
}): ReactElement => {
  return (
    <List>
      <StaticMenuItem
        name="Add Page"
        icon="AddCircleOutline"
        onclick={addPageHandler}
        showTooltipTitle={!menuExpanded}
      />
    </List>
  );
};

export default StaticMenuList;
