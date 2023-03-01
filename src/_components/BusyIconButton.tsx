import { CircularProgress, IconButton, IconButtonProps } from "@mui/material";
import React from "react";
import { usePromiseTracker } from "react-promise-tracker";

interface IBusyButtonProps {
  area: string;
}

const BusyIconButton: React.FC<IBusyButtonProps & IconButtonProps> = ({
  area,
  children,
  disabled,
  ...rest
}) => {
  const { promiseInProgress } = usePromiseTracker({ area: area });
  return (
    <IconButton {...rest} disabled={promiseInProgress || disabled} size="large">
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
    </IconButton>
  );
};
export default BusyIconButton;
