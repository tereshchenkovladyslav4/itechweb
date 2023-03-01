import React, { ReactElement } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Cancel, CheckCircle } from "@mui/icons-material";
import BusyButton from "../_components/BusyButton";

type AreYouSureProps = {
  onClose: () => void;
  onConfirm: () => Promise<void>;
  area:string;
};

const AreYouSure: React.FC<AreYouSureProps> = ({
  onClose,
  onConfirm,
  area,
}): ReactElement => {

  function _onConfirm() {
    onConfirm().then(onClose);
  }

  return (
    <form autoComplete="off">
      <Box p={3}>
        <Typography>Are you sure?</Typography>
      </Box>
      <BusyButton
        style={{ margin: "0 0 24px 24px" }}
        onClick={_onConfirm}
        startIcon={<CheckCircle/>}
        area={area}
      >
        Confirm
      </BusyButton>
      <Button
        variant="contained"
        color="primary"
        style={{ margin: "0 0 24px 24px" }}
        onClick={onClose}
        startIcon={<Cancel/>}
      >
        Cancel
      </Button>
    </form>
  );
};

export default AreYouSure;
