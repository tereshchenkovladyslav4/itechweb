import React, { useState } from "react";
import { alpha } from "@mui/material/styles";
import makeStyles from '@mui/styles/makeStyles';
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useHistory } from "react-router-dom";
import { AccountCircle } from "@mui/icons-material";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    color: theme.palette.secondary.contrastText,
    "& .MuiSvgIcon-root": {
      color: theme.palette.secondary.contrastText,
    },
    position: "absolute",
    bottom: 16,
    "& .MuiListItem-button:hover ": {
      backgroundColor: alpha(theme.palette.secondary.light, 0.1),
      color: theme.palette.button.main,
      "& .MuiSvgIcon-root": {
        color: theme.palette.button.main,
      },
    },
    "& .MuiPaper-root": {
      backgroundColor: theme.palette.background.default,
    },
  },
}));

interface IProfileListItemProps {
  profileName: string;
  menuExpanded: boolean;
  logoutHandler: () => void;
  area: string;
}

const ProfileListItem: React.FC<IProfileListItemProps> = ({
  profileName,
  logoutHandler,
}: IProfileListItemProps) => {
  const classes = useStyles();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSettings = () => {
    history.push("/settings");
  };

  return (
    <div className={classes.root}>
      <ListItem button onClick={handleClick}>
        <ListItemIcon>
          <AccountCircle />
        </ListItemIcon>
        <ListItemText primary={profileName} />
      </ListItem>
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
        <MenuItem onClick={handleSettings}>Settings</MenuItem>
        {/* <MenuItem>Help</MenuItem> */}
        <MenuItem onClick={logoutHandler}>Log out</MenuItem>
      </Menu>
    </div>
  );
};

export default ProfileListItem;
