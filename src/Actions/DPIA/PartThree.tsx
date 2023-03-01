import React, { ReactElement } from "react";
import { useStyles } from "./DPIA.styles";
import { Typography } from "@mui/material";
import { FormProps } from "./DPIA";

const PartThree: React.FC<FormProps> = ({ textField }): ReactElement => {
  const classes = useStyles();
  return (
    <>
      <Typography className={classes.section}>3. Identify the privacy and related risks</Typography>
      <Typography className={classes.subHeader}>
        List any privacy issues identified during the completion of section 2, or subsequently.
        Provide a unique reference to identify each issue
      </Typography>
      <Typography className={classes.subHeader}>
        Identify the key privacy risks and the associated compliance and corporate risks, with
        reference to the six GDPR principles outlined in GL UK&amp;I’ GDPR Policy, and any other
        relevant legislation such as PECR, or Article 8 of the ECHR
      </Typography>
      <Typography className={classes.subHeader}>
        Describe the actions which could be taken to reduce the risks – for example: the production
        of new guidance, or vulnerability/penetration testing for systems – and any future steps
        which might be necessary
      </Typography>
      <Typography className={classes.subHeader}>
        Confirm the degree to which the proposed solution will address the risk(s), and whether the
        processing will be justified, compliant and proportionate as a result
      </Typography>
      <Typography className={classes.subHeader}>
        Identify who will be responsible for implementing the solution(s) – including integrating
        the DPIA outcomes back into the project plan/business process documentation – and the date
        by which they should be in place.
      </Typography>
      {textField(
        "privacyIssues",
        "Privacy issue",
        "Outline the privacy issue that has been identified. Reference: Create a unique reference by which the issue and its resolution can be tracked.",
        10
      )}
      {textField(
        "risks",
        "Risks",
        `Risks to data subjects:
        Outline the risks to data subjects’ rights and freedoms which the issue creates.
        Compliance risks:
        Identify which regulations GL UK&I might be failing to comply with as a result of the issue.
        Associated risks to GL UK&I:
        Outline the risks to GL UK&I which could arise from the above.`,
        10
      )}
      {textField(
        "solutions",
        "Solution(s)",
        `Describe the steps that can/should be taken to address the issue.
        Future steps:
        Outline any further actions that may be required to ensure that the issue will not arise again in future.`,
        10
      )}
      {textField(
        "results",
        "Result & Evaluation",
        `Is the risk eliminated, reduced or accepted?
        Identify to what degree the risks will be eliminated by the solutions(s) identified.
        
        Indicate whether any residual risks will remain.
        Is the final impact on individuals after implementing the solution a justified, compliant and proportionate response?
        Indicate whether, following implementation of the identified solution(s), the resulting processing will meet all regulatory requirements.`,
        10
      )}
      {textField(
        "actionOwners",
        "Accepted By (action owner)",
        `Identify the owner for each remedial action/solution`,
        5
      )}
      {textField(
        "targetDates",
        "Target Date",
        `Indicate when each remedial action/ solution should be completed.`,
        5
      )}
      {textField(
        "additionalInformation",
        "Record any additional relevant information gathered during the DPIA process here",
        `For example: lessons learned during the DPIA which may be of use when carrying out DPIAs in future, useful sources of detailed guidance, any issues or concerns that haven’t already been captured in this document, etc.`,
        20
      )}
    </>
  );
};

PartThree.displayName = "PartThree";

export default PartThree;
