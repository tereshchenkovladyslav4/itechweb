import React, { ReactElement } from "react";
import { useStyles } from "./DPIA.styles";
import { Typography } from "@mui/material";
import { FormProps } from "./DPIA";

const PartOne: React.FC<FormProps> = ({ textField, boolean}): ReactElement => {
  const classes = useStyles();
  return (
    <>
      <Typography className={classes.section}>
        Part 1 – Information about the Project, Process or System
      </Typography>
      {textField("projectName", "Project/Process/System Name")}
      {textField("practiceName", "Practice Name or Team", "HR, Finance, IT, CX etc")}
      {textField(
        "reason",
        "Reason for DPIA",
        "New process or project, change to existing process, or review of existing process"
      )}
      {textField(
        "projectLead",
        "Project or Change Lead",
        "The person that is leading the project or change initiative"
      )}
      {textField("personName", "Name and role of person completing the DPIA")}
      {textField("dateSubmission", "Date of Submission", "Date the DPIA was submitted to the ADPO")}
      {textField("dateApproval", "Date of Approval", "Date of approval by DPO")}
      {textField("approvedBy", "Approved by", "Name of DPO")}
      {textField(
        "businessPurpose",
        "1.1 Business Purpose",
        "Describe the business purpose of the process or system and what it does"
      )}
      {textField(
        "dataProcessing",
        "Data processing",
        "Provide an overview of the type of data processed and the information flows e.g. where data is stored, who can access it and where they are located",
        2
      )}
      {textField(
        "dataLocations",
        "Data subject locations",
        "Indicate where the individuals whose data will be processed will be located (e.g. UK, EEA, USA, India, worldwide) Will we be required to put an IDTA in place for data transfers outside of the UK?"
      )}
      {boolean(
        "personalData",
        "1.2 Personal Data",
        "Does the process or system process personal data?",
        `Personal data can include: name; address; email address; telephone/mobile number; ID number (e.g. employee number, PAYE code, customer number); IP address or web browser cookie (online identifier); photograph; opinions about the individual; race or ethnic origin; health data; religious or philosophical beliefs; trade union membership; biometric or genetic data; sex life; sexual orientation; or any other data that can help identify an individual.
        Processing may include: collecting, gathering, receiving, storing, handling, transferring, sharing, transmitting, modifying, erasing, destroying, etc. Processing applies to internal practices and business units and to external third parties such as clients, service providers, business partners, contractors, regulators or any other third parties.
        If you have answered Yes to this question you must complete the rest of this document. For instances where a DPIA already exists for this process or system, you should update the existing DPIA.  
        If you have answered No then no further action is required.  You must however retain a copy of this DPIA as evidence of initial assessment, and store it in the assigned area for DPIAs.`
      )}
      {textField(
        "summary",
        "1.3 Summary",
        "Provide a summary of the findings, conclusion and recommendations made with regards to this assessment.  This should include a description of the system/process being assessed, the reason for processing personal data (if applicable) and a short note on the risks and issues identified and the approved methods for addressing these.",
        5
      )}
    </>
  );
};

PartOne.displayName = "PartOne";

export default PartOne;
