import React, { ReactElement, useEffect, useRef, useState } from "react";
import { trackPromise } from "react-promise-tracker";
import { Box, Portal, Typography } from "@mui/material";
import { taskService } from "../../_services/taskService";
import { Form, formFieldType, IFormField } from "../../_components/Form";
import { useStyles } from "./DPIAV2.styles";
import FormBuilder from "../../Form/FormBuilder";
import { ITechDataRopaMappingRegister } from "../../Model/iTechRestApi/ITechDataRopaMappingRegister";

type RopaMappingProps = {
  show: boolean;
  area?: string;
  disabled?: boolean;
  onClose?: () => void;
};

const RopaMapping: React.FC<RopaMappingProps> = ({ show, area = 'ropaMapping', onClose, disabled = false }) => {
  const classes = useStyles();
  const [data, setData] = useState<ITechDataRopaMappingRegister>(new ITechDataRopaMappingRegister());

  const _onActionClick = () => {
    return trackPromise(taskService.ropaMapping(data), area);
  };

  // use the dialog hide to clear state
  useEffect(() => {
    if (!show) {
      setData(new ITechDataRopaMappingRegister());
    }
  }, [show]);

  if(!show) return null;

  const fields = [
    {
      type: formFieldType.raw,
      raw: (
        <Box className={classes.subHeader}>
          <Typography variant="h5" padding={1}>
            GDPR Data Map
          </Typography>
        </Box>
      ),
    },
    {
      key: "source",
      label: "Source",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true },
    },
    {
      key: "personalData",
      label: "Personal Data",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true },
    },
    {
      key: "reason",
      label: "Reason",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true },
    },
    {
      key: "disposal",
      label: "Disposal",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true },
    },
     {
      type: formFieldType.raw,
      raw: (
        <Box className={classes.subHeader}>
          <Typography variant="h5" padding={1}>
            Handling
          </Typography>
        </Box>
      ),
    },
    {
      key: "datastore",
      label: "Data Store",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true },
    },
    {
      key: "processMethod",
      label: "How it's processed",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true },
    },
    {
      key: "accessRights",
      label: "Access rights",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true },
    },
    // {
    //   key: "relationshipReference",
    //   label: "Access rights",
    //   type: formFieldType.number,
    //   disabled: disabled,
    //   extraProps: { fullWidth: true },
    // },
    
  ] as Array<IFormField<ITechDataRopaMappingRegister>>;

  return (
    <Box className={classes.container}>
      <Form
        onSubmit={_onActionClick}
        model={data}
        setModel={setData}
        formFields={fields}
        area={area}
        submitBtnText="Submit"
        title=""
        description=""
        onClose={onClose}
        isModal={onClose !== undefined}
        showErrorSummary={true}
        submitBtnClass={classes.button}
      ></Form>
    </Box>
  );
};

RopaMapping.displayName = "RopaMapping";

export default RopaMapping;

interface AddRopaMappingDlgProps {
  show: boolean;
  setShow: (show: boolean) => void;
}

export const AddRopaMappingDlg: React.FC<AddRopaMappingDlgProps> = ({ show, setShow }): ReactElement => {
  const container = useRef();

  return (
    <Portal container={container.current}>
      <FormBuilder propDisplay={show} onChange={setShow}>
        <RopaMapping onClose={() => setShow(false)} show={show} />
      </FormBuilder>
    </Portal>
  );
};
