import React, { ReactElement, useState } from "react";
import { useStyles } from "./VerificationAcknowledgement.styles";
import { trackPromise } from "react-promise-tracker";
import { throwError } from "rxjs";
import { useStore } from "../../_context/Store";
import { Button, Box } from "@mui/material";
import { taskService } from "../../_services/taskService";
import ComponentError from "../../_helpers/ComponentError";
import ReadOnly from "../ReadOnly/ReadOnly";

type VerificationAcknowledgementProps = {
  area?: string;
  disabled?: boolean;
};

const VerificationAcknowledgement: React.FC<VerificationAcknowledgementProps> = ({
  area,
  disabled = false,
}): ReactElement => {
  const classes = useStyles();
  const { selectors } = useStore();
  const [available, setAvailable] = useState<boolean>(!disabled);

  const _onActionClick = () => {
    const selectedItem = selectors.getSelectedGridRow();
    if (selectedItem) {
      return trackPromise(taskService.verification(), area).then(
        (result) => {
          setAvailable(false);
        },
        (error) => {
          throwError(
            new ComponentError(VerificationAcknowledgement.displayName, error?.message || error)
          );
        }
      );
    }
  };

  return (
    <Box m={1}>
      {selectors.getSelectedGridRow()?.taskStatusType !== "Done" && (
        <Button
          className={classes.button}
          variant="outlined"
          disabled={!available}
          onClick={() => _onActionClick()}
        >
          Resend Verification Email
        </Button>
      )}
      <ReadOnly />
    </Box>
  );
};

VerificationAcknowledgement.displayName = "VerificationAcknowledgement";

export default VerificationAcknowledgement;
