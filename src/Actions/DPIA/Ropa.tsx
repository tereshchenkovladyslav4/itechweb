import React, { ReactElement, useEffect, useRef, useState } from "react";
import { trackPromise } from "react-promise-tracker";
import { Box, Portal, Typography } from "@mui/material";
import { taskService } from "../../_services/taskService";
import { Form, formFieldType, IFormField } from "../../_components/Form";
import { useStyles } from "./DPIAV2.styles";
import FormBuilder from "../../Form/FormBuilder";
import { ITechDataRopa } from "../../Model/iTechRestApi/ITechDataRopa";

type RopaProps = {
  show: boolean;
  area?: string;
  disabled?: boolean;
  onClose?: () => void;
};

const Ropa: React.FC<RopaProps> = ({ show, area = 'ropa', onClose, disabled = false }) => {
  const classes = useStyles();
  const [data, setData] = useState<ITechDataRopa>(new ITechDataRopa());

  const _onActionClick = () => {
    return trackPromise(taskService.ropa(data), area);
  };

  // use the dialog hide to clear state
  useEffect(() => {
    if (!show) {
      setData(new ITechDataRopa());
    }
  }, [show]);

  if(!show) return null;

  const fields = [
    {
      type: formFieldType.raw,
      raw: (
        <Typography className={classes.header}>
          Use this template to document the processing activities you undertake as a controller.
          <br />
          For more detailed guidance on documentation, please see the Guide to GDPR on our website.
        </Typography>
      ),
    },
    {
      type: formFieldType.raw,
      raw: (
        <Box className={classes.subHeader}>
          <Typography variant="h5" padding={1}>
            Article 30 Record of Processing Activities
          </Typography>
        </Box>
      ),
    },
    {
      key: "businessFunction",
      label: "Business function",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true },
    },
    {
      key: "processingPurpose",
      label: "Purpose of processing",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true },
    },
    {
      key: "jointController",
      label: "Name and contact details of joint controller (if applicable)",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true, multiline: true, rows: 6 },
    },
    {
      key: "individualsCategory",
      label: "Categories of individuals",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true },
    },
    {
      key: "personalDataCategory",
      label: "Categories of personal data",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true },
    },
    {
      key: "recipientCategory",
      label: "Categories of recipients",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true },
    },
    {
      key: "contractLink",
      label: "Link to contract with processor",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true },
    },
    {
      key: "transferLocation",
      label:
        "Names of third countries or international organisations that personal data are transferred to (if applicable)",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true, multiline: true, rows: 6 },
    },
    {
      key: "transferSafeguards",
      label:
        "Safeguards for exceptional transfers of personal data to third countries or international organisations (if applicable)",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true, multiline: true, rows: 6 },
    },
    {
      key: "retentionSchedule",
      label: "Retention schedule (if possible)",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true },
    },
    {
      key: "securityMeasures",
      label: "General description of technical and organisational security measures (if possible)",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true },
    },
    {
      type: formFieldType.raw,
      raw: (
        <Box className={classes.subHeader}>
          <Typography variant="h5" padding={1}>
            Privacy Notices
          </Typography>
        </Box>
      ),
    },
    {
      key: "article6Basis",
      label: "Article 6 lawful basis for processing personal data",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true },
    },
    {
      key: "article9Condition",
      label: "Article 9 condition for processing special category data",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true },
    },
    {
      key: "processingInterests",
      label: "Legitimate interests for the processing (if applicable)",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true },
    },
    {
      key: "processingInterestsLink",
      label: "Link to record of legitimate interests assessment (if applicable)",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true },
    },
    {
      key: "rightsAvailable",
      label: "Rights available to individuals",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true },
    },
    {
      key: "hasAutomatedDecisionMaking",
      label: "Existence of automated decision-making, including profiling (if applicable)",
      type: formFieldType.radioGroup,
      disabled: disabled,
      values: [
        { key: "false", description: "No" },
        { key: "true", description: "Yes" },
      ],
    },
    {
      key: "personalDataSource",
      label: "The source of the personal data (if applicable)",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true },
    },
    {
      type: formFieldType.raw,
      raw: (
        <Box className={classes.subHeader}>
          <Typography variant="h5" padding={1}>
            Consent
          </Typography>
        </Box>
      ),
    },
    {
      key: "consentLink",
      label: "Link to record of consent",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true },
    },
    {
      type: formFieldType.raw,
      raw: (
        <Box className={classes.subHeader}>
          <Typography variant="h5" padding={1}>
            Access Requests
          </Typography>
        </Box>
      ),
    },
    {
      key: "dataLocation",
      label: "Location of personal data",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true },
    },
    {
      type: formFieldType.raw,
      raw: (
        <Box className={classes.subHeader}>
          <Typography variant="h5" padding={1}>
            Data Protection Impact Assessments
          </Typography>
        </Box>
      ),
    },
    {
      key: "dpiaRequired",
      label: "Data Protection Impact Assessment required?",
      type: formFieldType.radioGroup,
      disabled: disabled,
      values: [
        { key: "false", description: "No" },
        { key: "true", description: "Yes" },
      ],
    },
    {
      key: "dpiaProgress",
      label: "Data Protection Impact Assessment progress",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true },
    },
    {
      key: "dpiaLink",
      label: "Link to Data Protection Impact Assessment",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true },
    },
    {
      type: formFieldType.raw,
      raw: (
        <Box className={classes.subHeader}>
          <Typography variant="h5" padding={1}>
            Personal Data Breaches
          </Typography>
        </Box>
      ),
    },
    {
      key: "hasBreachOccurred",
      label: "Has a personal data breach occurred?",
      type: formFieldType.radioGroup,
      disabled: disabled,
      values: [
        { key: "false", description: "No" },
        { key: "true", description: "Yes" },
      ],
    },
    {
      key: "breachLink",
      label: "Link to record of personal data breach",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true },
    },
    {
      type: formFieldType.raw,
      raw: (
        <Box className={classes.subHeader}>
          <Typography variant="h5" padding={1}>
            Data Protection Act 2018 - Special Category or Criminal Conviction and Offence data
          </Typography>
        </Box>
      ),
    },
    {
      key: "dpaSchedule",
      label: "Data Protection Act 2018 Schedule Condition for processing",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true },
    },
    {
      key: "gdprArticle6Basis",
      label: "GDPR Article 6 lawful basis for processing",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true },
    },
    {
      key: "retentionErasurePolicyLink",
      label: "Link to retention and erasure policy document",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true },
    },
    {
      key: "retentionErasureCompliance",
      label: "Is personal data retained and erased in accordance with the policy document?",
      type: formFieldType.radioGroup,
      disabled: disabled,
      values: [
        { key: "false", description: "No" },
        { key: "true", description: "Yes" },
      ],
    },
    {
      key: "policyNonAdherenceReason",
      label: "Reasons for not adhering to policy document (if applicable)",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true },
    },
  ] as Array<IFormField<ITechDataRopa>>;

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

Ropa.displayName = "Ropa";

export default Ropa;

interface AddRopaDlgProps {
  show: boolean;
  setShow: (show: boolean) => void;
}

export const AddRopaDlg: React.FC<AddRopaDlgProps> = ({ show, setShow }): ReactElement => {
  const container = useRef();

  return (
    <Portal container={container.current}>
      <FormBuilder propDisplay={show} onChange={setShow}>
        <Ropa onClose={() => setShow(false)} show={show} />
      </FormBuilder>
    </Portal>
  );
};
