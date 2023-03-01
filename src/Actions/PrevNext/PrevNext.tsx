import React, { ReactElement } from "react";
import { useStyles } from "./PrevNext.styles";
import { Button, Box } from "@mui/material";
import { Direction } from "../../Model/Types/Direction";
import { MoveSelectedEvent, MoveSelectedItemEvent, trigger } from "../../_helpers/events";

interface IPrevNextProps {
  hideSkip?: boolean;
}
const PrevNext: React.FC<IPrevNextProps> = ({ hideSkip = false }): ReactElement => {
  const classes = useStyles();

  const _onDirectionClick = (direction: Direction) => {
    trigger(MoveSelectedItemEvent, {
      direction: direction,
    } as MoveSelectedEvent);
  };

  return (
    <Box mb={1} p={1} className={classes.buttonRow}>
      <Button
        className={classes.button}
        color="secondary"
        onClick={() => _onDirectionClick(Direction.Up)}
      >
        Previous
      </Button>
      {!hideSkip && (
        <Button
          className={classes.button}
          color="secondary"
          onClick={() => _onDirectionClick(Direction.Skip)}
        >
          Skip
        </Button>
      )}
      <Button
        className={classes.button}
        color="secondary"
        onClick={() => _onDirectionClick(Direction.Down)}
      >
        Next
      </Button>
    </Box>
  );
};

PrevNext.displayName = "PrevNext";

export default PrevNext;
