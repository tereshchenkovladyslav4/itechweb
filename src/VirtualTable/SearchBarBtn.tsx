import React, { ReactElement } from "react";
import { Button, Tooltip } from "@mui/material";

type SearchBarButtonProps = {
  text: string;
  tooltip:string;
  onClick: () => void;
  isEnabled: boolean;
};

const SearchBarBtn: React.FC<SearchBarButtonProps> = ({
  text,
  tooltip,
  onClick,
  isEnabled,
}): ReactElement => {
  return (
    <Tooltip title={tooltip} placement="left">
      <span>
        <Button
          variant="contained"
          color="primary"
          disabled={!isEnabled}
          onClick={onClick}
          style={{marginLeft:"2px"}}
        >
          {text}
        </Button>
      </span>
    </Tooltip>
  );
};

export default SearchBarBtn;
