import { Button, ButtonProps, CircularProgress } from "@mui/material";
import React from "react";
import { usePromiseTracker } from "react-promise-tracker";

interface IBusyButtonProps {
  area: string;
}

const BusyButton: React.FC<IBusyButtonProps & ButtonProps> = ({
  area,
  children,
  disabled,
  ...rest
}) => {
  const { promiseInProgress } = usePromiseTracker({ area: area });
  return (
    <Button color="primary" variant="contained" {...rest} disabled={promiseInProgress || disabled}>
      {promiseInProgress ? (
        <>
          {children}
          <CircularProgress
            size={15}
            color="secondary"
            style={{ top: "calc(50% - 7.5px)", position: "absolute", left: "calc(50% - 7.5px)" }}
          />
        </>
      ) : (
        children
      )}
    </Button>
  );
};
export default BusyButton;
