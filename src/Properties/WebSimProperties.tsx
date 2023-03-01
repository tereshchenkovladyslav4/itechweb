import React, { ReactElement } from "react";
import { useStyles } from "./ListDisplay.styles";
import { Box, Typography } from "@mui/material";
import clsx from "clsx";

type WebSimPropertiesProps = {
  dict: { key: string; value: any }[];
};

const WebSimProperties: React.FC<WebSimPropertiesProps> = ({ dict, ...rest }): ReactElement => {
  const classes = useStyles();

  const _renderInfo = (key: string, split = "", header = "") => {
    let value = dict.find((x) => x.key === key)?.value;
    if (split.length > 0)
      value = value.split(split).map((x: string, i: number) => <p key={i}>{x}</p>);

    if (value?.length === 0) return null;

    return (
      <Box className={classes.info}>
        <Typography variant="h6" component="span">
          {header?.length > 0 ? header : key}
        </Typography>
        <Typography variant="body2" component="span">
          {value}
        </Typography>
      </Box>
    );
  };

  return (
    <div className={clsx(classes.root, classes.vertical)} {...rest}>
      <div className={classes.innerPadding}>
        <div className={clsx(classes.vertical, classes.header)}>
          {_renderInfo("Summary")}
          {_renderInfo("File Date")}
          {_renderInfo("File Type")}
          {_renderInfo("Duration")}
        </div>
        <div className={classes.horizontal}>
          <div className={classes.column}>{_renderInfo("From", ";", "From / Participants")}</div>
          <div className={classes.column}>{_renderInfo("To", ";")}</div>
          <div className={classes.column}>{_renderInfo("Owners", ";")}</div>
          <div className={classes.column}>{_renderInfo("Companies")}</div>
        </div>
      </div>
    </div>
  );
};

export default WebSimProperties;
