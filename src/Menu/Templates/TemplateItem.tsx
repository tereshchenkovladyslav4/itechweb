import React, { ReactElement, useState } from "react";
import makeStyles from '@mui/styles/makeStyles';
import StarIcon from "@mui/icons-material/Star";
import IconManager from "../../_components/IconManager";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import Tippy from "@tippyjs/react";
import { Instance } from "tippy.js";
import MenuActions from "../MenuActions";
import { MenuAction } from "../MenuFunction";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(4),
    overflowX: "hidden",
  },
  labelRoot: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0.5, 0),
  },
}));

type TemplateItemProps = {
  item: any;
  onSelect: any;
  onDelete: any;
  i: number;
  showActions?: boolean;
};

const TemplateItem: React.FC<TemplateItemProps> = ({
  item,
  onSelect,
  onDelete,
  showActions = true,
}): ReactElement => {
  const classes = useStyles();
  const [instance, setInstance] = useState<Instance>();
  const hide = () => {
    instance?.hide();
  };

  const actions: MenuAction[] = [
    {
      icon: (
        <IconManager
          fontSize="small"
          icon="Delete"
          onClick={(e: any) => onDelete(e)}
        />
      ),
      name: "Delete",
      id: 3,
      toolTipPlacement: "bottom",
    },
  ];

  const tooltipText = item.name;

  return (
    <span className="menuContainer">
      <Tippy
        interactive={true}
        placement="right"
        offset={[0, -20]}
        appendTo={document.body}
        delay={[500, 0]}
        animation="scale"
        hideOnClick={"toggle"}
        onCreate={(i) => setInstance(i)}
        content={
          <MenuActions actions={actions} gid={"changeme"} onClick={hide} display="row"/>
        }
      >
        <ListItem
          button
          key={item.position}
          tabIndex={item.position}
          classes={{ root: classes.root }}
          onClick={(e: any) => onSelect(e)}
        >
          <Tooltip title={tooltipText} placement="right">
            <ListItemIcon>
              <StarIcon />
            </ListItemIcon>
          </Tooltip>
          <ListItemText
            primary={item.name}
            secondary={
              item.forename
                ? item.forename + (item.surname ? " " + item.surname : "")
                : null
            }
          />
        </ListItem>
      </Tippy>
    </span>
  );
};

export default TemplateItem;
