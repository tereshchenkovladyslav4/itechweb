import React from "react";
import { useStyles } from "./ListDisplay.styles";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { convertMstoTime } from "../_helpers/durationConverter";

export interface IListDisplayProps {
  dict: { key: string; value: any }[];
}

const ListDisplay: React.FC<IListDisplayProps> = ({ dict, ...rest }) => {
  const classes = useStyles();

  const getValue = (kvp: { key: string; value: any }): string => {
    if (/duration/i.test(kvp.key?.toString()) && typeof kvp.value === "number") {
      return convertMstoTime(kvp.value);
    }
    return kvp.value?.toString() || "";
  };

  const chunks = (): { key: string; value: any }[][] => {
    const arr = dict.filter((kvp) => kvp.value?.toString().length > 0);
    const chunkSize = Math.ceil(arr.length / 3);
    return sliceIntoChunks(arr, chunkSize);
  };

  function sliceIntoChunks(arr: { key: string; value: any }[], chunkSize: number) {
    const res = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      const end = i === arr.length - 1 ? undefined : i + chunkSize;
      const chunk = arr.slice(i, end);
      res.push(chunk);
    }
    return res;
  }

  return (
    <div className={classes.root} {...rest}>
      {chunks().map((c, i) => {
        return (
          <div className={classes.chunk} key={i}>
            <List dense={true} className={classes.listDisplay}>
              {c?.map((kvp) => (
                <ListItem key={kvp.key} className={classes.listItem}>
                  <ListItemText
                    primary={kvp.key?.toString()}
                    secondary={getValue(kvp)}
                    classes={{ primary: classes.listItemText, secondary: classes.listItemContent }}
                  />
                </ListItem>
              ))}
            </List>
          </div>
        );
      })}
    </div>
  );
};

export default ListDisplay;
