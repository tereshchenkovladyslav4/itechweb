import React, { ReactElement, useEffect, useRef, useState } from "react";
import { trackPromise } from "react-promise-tracker";
import { Box, Portal, Typography } from "@mui/material";
import { taskService } from "../../_services/taskService";
import {
  Form,
  formFieldType,
  getEnumKeyValuePairs,
  IFormField,
  IKeyValue,
} from "../../_components/Form";
import moment from "moment";
import { ITechDataDpiaV2 } from "../../Model/iTechRestApi/ITechDataDpiaV2";
import { useStyles } from "./DPIAV2.styles";
import FormBuilder from "../../Form/FormBuilder";

type DPIAV2Props = {
  show: boolean;
  area?: string;
  disabled?: boolean;
  onClose?: () => void;
};

enum Likelihood {
  Remote = 1,
  Possible,
  Probable,
}

enum Severity {
  Minimal = 1,
  Significant,
  Severe,
}

enum Risk {
  Low = 1,
  Medium,
  High,
}

enum Effect {
  Eliminated = 1,
  Reduced,
  Accepted,
}

const DPIAV2: React.FC<DPIAV2Props> = ({
  show,
  area = "dpiav2",
  onClose,
  disabled = false,
}) => {
  const classes = useStyles();
  // const { selectors } = useStore();
  // const selectedItem = selectors.getSelectedGridRow();
  const [dpia, setDpia] = useState<ITechDataDpiaV2>(new ITechDataDpiaV2());

  // useEffect(() => {
  //   // TODO: load DPIA from task.args => iTechDataDpia=1
  //   if (!selectedItem?.args.includes("iTechDataDpia=")) return;

  //   const rowId = selectedItem.args.split("=").pop(); // assumes dpia is last param!
  //   if (rowId && !rowId.includes("null"))
  //     trackPromise(taskService.getDpiaV2(rowId), area).then((result) => {
  //       setDpia(result);
  //     });
  // }, [selectors.getSelectedGridRow()]);


  // use the dialog hide to clear state
  useEffect(() => {
    if (!show) {
      setDpia(new ITechDataDpiaV2());
    }
  }, [show]);

  if(!show) return null;

  const _onActionClick = () => {
    // if (selectedItem) {
    //   return trackPromise(taskService.dpiaV2(selectedItem?.rowId, dpia), area);
    // }
    return trackPromise(taskService.dpiaV2(dpia), area);
  };

  const likelihoodValues = [{ key: "-1", description: "" } as IKeyValue].concat(
    getEnumKeyValuePairs(Likelihood)
  );
  const severityValues = [{ key: "-1", description: "" } as IKeyValue].concat(
    getEnumKeyValuePairs(Severity)
  );
  const riskValues = [{ key: "-1", description: "" } as IKeyValue].concat(
    getEnumKeyValuePairs(Risk)
  );
  const effectValues = [{ key: "-1", description: "" } as IKeyValue].concat(
    getEnumKeyValuePairs(Effect)
  );
  const tomorrow = moment().add(1, "days").toDate();

  const fields = [
    {
      type: formFieldType.raw,
      raw: (
        <Typography className={classes.header}>
          This template is an example of how you can record your DPIA process and outcome. It
          follows the process set out in our DPIA guidance, and should be read alongside that
          guidance and the{" "}
          <a href="http://ec.europa.eu/newsroom/document.cfm?doc_id=47711">
            Criteria for an acceptable DPIA
          </a>{" "}
          set out in European guidelines on DPIAs.
          <br />
          You should start to fill out the template at the start of any major project involving the
          use of personal data, or if you are making a significant change to an existing process.
          The final outcomes should be integrated back into your project plan.
        </Typography>
      ),
    },
    {
      type: formFieldType.raw,
      raw: (
        // <Box sx={{ width: "100%", backgroundColor: "darkblue" }}>
        <Box className={classes.subHeader}>
          <Typography variant="h5" padding={1}>
            Submitting controller details
          </Typography>
        </Box>
      ),
    },
    {
      key: "controllerName",
      label: "Name of controller",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { autoFocus: true, fullWidth: true, className: classes.textField },
    },
    {
      key: "dpoSubject",
      label: "Subject / title of DPO",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true },
    },
    {
      key: "controllerContactName",
      label: "Name of controller contact / DPO",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true },
    },
    {
      type: formFieldType.raw,
      raw: (
        <Box className={classes.subHeader}>
          <Typography variant="h5" padding={1}>
            Step 1: Identify the need for a DPIA
          </Typography>
        </Box>
      ),
    },
    {
      key: "needForDpia",
      label:
        "Explain broadly what project aims to achieve and what type of processing it involves. You may find it helpful to refer or link to other documents, such as a project proposal. Summarise why you identified the need for a DPIA.",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true, multiline: true, rows: 8 },
    },
    {
      type: formFieldType.raw,
      raw: (
        <Box className={classes.subHeader}>
          <Typography variant="h5" padding={1}>
            Step 2: Describe the processing
          </Typography>
        </Box>
      ),
    },
    {
      key: "processingNature",
      label:
        "Describe the nature of the processing: how will you collect, use, store and delete data? What is the source of the data? Will you be sharing data with anyone? You might find it useful to refer to a flow diagram or other way of describing data flows. What types of processing identified as likely high risk are involved?",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true, multiline: true, rows: 8 },
    },
    {
      key: "processingScope",
      label:
        "Describe the scope of the processing: what is the nature of the data, and does it include special category or criminal offence data? How much data will you be collecting and using? How often? How long will you keep it? How many individuals are affected? What geographical area does it cover?",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true, multiline: true, rows: 8 },
    },
    {
      key: "processingContext",
      label:
        "Describe the context of the processing: what is the nature of your relationship with the individuals? How much control will they have? Would they expect you to use their data in this way? Do they include children or other vulnerable groups? Are there prior concerns over this type of processing or security flaws? Is it novel in any way? What is the current state of technology in this area? Are there any current issues of public concern that you should factor in? Are you signed up to any approved code of conduct or certification scheme (once any have been approved)?",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true, multiline: true, rows: 8 },
    },
    {
      key: "processingPurpose",
      label:
        "Describe the purposes of the processing: what do you want to achieve? What is the intended effect on individuals? What are the benefits of the processing – for  you, and more broadly? ",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true, multiline: true, rows: 8 },
    },
    {
      type: formFieldType.raw,
      raw: (
        <Box className={classes.subHeader}>
          <Typography variant="h5" padding={1}>
            Step 3: Consultation process
          </Typography>
        </Box>
      ),
    },
    {
      key: "stakeholderConsultation",
      label:
        "Consider how to consult with relevant stakeholders: describe when and how you will seek individuals’ views – or justify why it’s not appropriate to do so. Who else do you need to involve within your organisation? Do you need to ask your processors to assist? Do you plan to consult information security experts, or any other experts?",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true, multiline: true, rows: 8 },
    },
    {
      type: formFieldType.raw,
      raw: (
        <Box className={classes.subHeader}>
          <Typography variant="h5" padding={1}>
            Step 4: Assess necessity and proportionality
          </Typography>
        </Box>
      ),
    },
    {
      key: "complianceMeasures",
      label:
        "Describe compliance and proportionality measures, in particular: what is your lawful basis for processing? Does the processing actually achieve your purpose? Is there another way to achieve the same outcome? How will you prevent function creep? How will you ensure data quality and data minimisation? What information will you give individuals? How will you help to support their rights? What measures do you take to ensure processors comply? How do you safeguard any international transfers?",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true, multiline: true, rows: 8 },
    },
    {
      type: formFieldType.raw,
      raw: (
        <Box className={classes.subHeader}>
          <Typography variant="h5" padding={1}>
            Step 5: Identify and assess risks
          </Typography>
        </Box>
      ),
    },
    {
      key: "riskSource",
      label:
        "Describe source of risk and nature of potential impact on individuals. Include associated compliance and corporate risks as necessary.",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true, multiline: true, rows: 8 },
    },
    {
      key: "riskHarmLikelihood",
      label: "Likelihood of harm",
      type: formFieldType.dropdown,
      disabled: disabled,
      values: likelihoodValues,
      extraProps: { className: classes.dropdown },
    },
    {
      key: "riskHarmSeverity",
      label: "Severity of harm",
      type: formFieldType.dropdown,
      disabled: disabled,
      values: severityValues,
      extraProps: { className: classes.dropdown },
    },
    {
      key: "riskOverall",
      label: "Overall risk",
      type: formFieldType.dropdown,
      disabled: disabled,
      values: riskValues,
      extraProps: { className: classes.dropdown },
    },
    {
      type: formFieldType.raw,
      raw: (
        <Box className={classes.subHeader}>
          <Typography variant="h5" padding={1}>
            Step 6: Identify measures to reduce risk
          </Typography>
        </Box>
      ),
    },
    {
      type: formFieldType.raw,
      raw: (
        <Box className={classes.section}>
          <Typography variant="body1">
            Identify additional measures you could take to reduce or eliminate risks identified as
            medium or high risk in step 5
          </Typography>
        </Box>
      ),
    },
    {
      key: "riskToReduce",
      label: "Risk",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true },
    },
    {
      key: "riskReduction",
      label: "Options to reduce or eliminate risk",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true, multiline: true, rows: 8 },
    },
    {
      key: "riskReductionEffect",
      label: "Effect on risk",
      type: formFieldType.dropdown,
      disabled: disabled,
      values: effectValues,
      extraProps: { className: classes.dropdown },
    },
    {
      key: "riskResidual",
      label: "Residual risk",
      type: formFieldType.dropdown,
      disabled: disabled,
      values: riskValues,
      extraProps: { className: classes.dropdown },
    },
    {
      key: "riskMeasureApproved",
      label: "Measure approved",
      type: formFieldType.radioGroup,
      disabled: disabled,
      values: [
        { key: "false", description: "No" },
        { key: "true", description: "Yes" },
      ],
    },
    {
      type: formFieldType.raw,
      raw: (
        <Box className={classes.subHeader}>
          <Typography variant="h5" padding={1}>
            Step 7: Sign off and record outcomes
          </Typography>
        </Box>
      ),
    },
    {
      type: formFieldType.raw,
      raw: (
        <Box className={classes.section}>
          <Typography variant="body1" fontWeight={600}>
            Measures approved by
          </Typography>
          <Typography variant="body2">
            <strong>Note: </strong>
            Integrate actions back into project plan, with date and responsibility for completion
          </Typography>
        </Box>
      ),
    },
    {
      key: "measuresApprovedByName",
      label: "Name",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true },
    },
    {
      key: "measureApprovedByPosition",
      label: "Position",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true },
    },
    {
      key: "measureApprovedByDate",
      label: "Date",
      type: formFieldType.date,
      disabled: disabled,
      extraProps: { maxDate: tomorrow },
    },
    {
      type: formFieldType.raw,
      raw: (
        <Box className={classes.section}>
          <Typography variant="body1" fontWeight={600}>
            Residual risks approved by
          </Typography>
          <Typography variant="body2">
            <strong>Note: </strong>
            If accepting any residual high risk, consult the ICO before going ahead
          </Typography>
        </Box>
      ),
    },
    {
      key: "residualRiskApprovedByName",
      label: "Name",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true },
    },
    {
      key: "residualRiskApprovedByPosition",
      label: "Position",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true },
    },
    {
      key: "residualRiskApprovedByDate",
      label: "Date",
      type: formFieldType.date,
      disabled: disabled,
      extraProps: { maxDate: tomorrow },
    },
    {
      type: formFieldType.raw,
      raw: (
        <Box className={classes.section}>
          <Typography variant="body1" fontWeight={600}>
            DPO advice provided
          </Typography>
          <Typography variant="body2">
            <strong>Note: </strong>
            DPO should advise on compliance, step 6 measures and whether processing can proceed
          </Typography>
        </Box>
      ),
    },
    {
      key: "dpoadviceProvidedByName",
      label: "Name",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true },
    },
    {
      key: "dpoadviceProvidedByPosition",
      label: "Position",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true },
    },
    {
      key: "dpoadviceProvidedByDate",
      label: "Date",
      type: formFieldType.date,
      disabled: disabled,
      extraProps: { maxDate: tomorrow },
    },
    {
      key: "dpoadviceSummary",
      label: "Summary of DPO advice",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true, multiline: true, rows: 6 },
    },
    {
      type: formFieldType.raw,
      raw: (
        <Box className={classes.section}>
          <Typography variant="body1" fontWeight={600}>
            DPO advice accepted or overruled by
          </Typography>
          <Typography variant="body2">
            <strong>Note: </strong>
            If overruled, you must explain your reasons
          </Typography>
        </Box>
      ),
    },
    {
      key: "dpoadviceAcceptedByName",
      label: "Name",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true },
    },
    {
      key: "dpoadviceAcceptedByPosition",
      label: "Position",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true },
    },
    {
      key: "dpoadviceAcceptedByDate",
      label: "Date",
      type: formFieldType.date,
      disabled: disabled,
      extraProps: { maxDate: tomorrow },
    },
    {
      key: "dpoadviceAcceptedComments",
      label: "Comments",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true, multiline: true, rows: 6, size: "small" },
    },
    {
      type: formFieldType.raw,
      raw: (
        <Box className={classes.section}>
          <Typography variant="body1" fontWeight={600}>
            Consultation responses reviewed by
          </Typography>
          <Typography variant="body2">
            <strong>Note: </strong>
            If your decision departs from individuals’ views, you must explain your reasons
          </Typography>
        </Box>
      ),
    },
    {
      key: "responsesReviewedByName",
      label: "Name",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true },
    },
    {
      key: "responsesReviewedByPosition",
      label: "Position",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true },
    },
    {
      key: "responsesReviewedByDate",
      label: "Date",
      type: formFieldType.date,
      disabled: disabled,
      extraProps: { maxDate: tomorrow },
    },
    {
      key: "responsesReviewedComments",
      label: "Comments",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true, multiline: true, rows: 6, size: "small" },
    },
    {
      type: formFieldType.raw,
      raw: (
        <Box className={classes.section}>
          <Typography variant="body1" fontWeight={600}>
            This DPIA will kept under review by
          </Typography>
          <Typography variant="body2">
            <strong>Note: </strong>
            The DPO should also review ongoing compliance with DPIA
          </Typography>
        </Box>
      ),
    },
    {
      key: "dpiakeptByName",
      label: "Name",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true },
    },
    {
      key: "dpiakeptByPosition",
      label: "Position",
      type: formFieldType.text,
      disabled: disabled,
      extraProps: { fullWidth: true },
    },
    {
      key: "dpiakeptByDate",
      label: "Date",
      type: formFieldType.date,
      disabled: disabled,
      extraProps: { maxDate: tomorrow },
    },
  ] as Array<IFormField<ITechDataDpiaV2>>;

  return (
    <Box className={classes.container}>
      <Form
        onSubmit={_onActionClick}
        model={dpia}
        setModel={setDpia}
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

DPIAV2.displayName = "DPIAV2";

export default DPIAV2;

interface AddDpiaV2DlgProps {
  show: boolean;
  setShow: (show: boolean) => void;
}

export const AddDpiaV2Dlg: React.FC<AddDpiaV2DlgProps> = ({ show, setShow }): ReactElement => {
  const container = useRef();

  return (
    <Portal container={container.current}>
      <FormBuilder propDisplay={show} onChange={setShow}>
        <DPIAV2 onClose={() => setShow(false)} show={show} />
      </FormBuilder>
    </Portal>
  );
};
