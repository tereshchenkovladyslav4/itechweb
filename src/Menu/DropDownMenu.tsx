import React, { ReactElement, useState } from "react";
import StaticMenuItem from "./StaticMenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import { useHistory } from "react-router-dom";
import LoadingFab from "../_components/LoadingFab";
import makeStyles from '@mui/styles/makeStyles';

type DropDownMenuProps = {
  menuExpanded: any;
  profileName: any;
  logoutHandler: any;
  area?: string;
};

const useStyles = makeStyles(() => ({
  dropDownMenu:{
    position: "absolute",
    right: 10,
    top: 5,
  }
}));

const DropDownMenu: React.FC<DropDownMenuProps> = ({
  menuExpanded,
  profileName,
  logoutHandler,
  area 
}): ReactElement => {
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.dropDownMenu}>
      <LoadingFab icon={<MoreVertIcon/>} onClick={handleClick} area={area} />
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        // getContentAnchorEl={null}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <StaticMenuItem
          name={profileName}
          icon="AccountCircle"
          onclick={() => history.push("/settings")}
          showTooltipTitle={!menuExpanded}
        />
        <StaticMenuItem
          name="Help"
          icon="HelpOutline"
          onclick={null}
          showTooltipTitle={!menuExpanded}
        />
        <StaticMenuItem
          name="Log out"
          icon="ExitToApp"
          onclick={logoutHandler}
          showTooltipTitle={!menuExpanded}
        />
      </Menu>
    </div>
  );
};

export default DropDownMenu;
