import { PropTypes } from "@mui/material";
import React from "react";
import ItemMenu from "./ItemMenu";

interface ISelectedCaseMenuProps {
  caseReference: string;
  color: PropTypes.Color;
}

const SelectedCaseMenu: React.FC<ISelectedCaseMenuProps> = ({ caseReference, color }) => {
  return (
    <ItemMenu
      actions={[]}
      gid={caseReference}
      onClick={() =>
        window.open(
          `${window.location.origin.toString()}/cases/${caseReference
            .toLowerCase()
            .replace(" ", "_")}/`,
          "_blank"
        )
      }
      color={color}
    />
  );
};

export default SelectedCaseMenu;
