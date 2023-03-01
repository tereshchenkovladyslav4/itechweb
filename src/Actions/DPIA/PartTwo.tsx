import React, { ReactElement } from "react";
import { useStyles } from "./DPIA.styles";
import { Typography } from "@mui/material";
import { FormProps } from "./DPIA";

const PartTwo: React.FC<FormProps> = ({ textField, boolean, radio, checkbox }): ReactElement => {
  const classes = useStyles();
  const defaultAlter = {
    display: "Other (please specify)",
    helperText: "Further relevant information/explanation can also be added here if required.",
  };
  const defaultAlters = [defaultAlter];

  return (
    <>
      <Typography className={classes.section}>
        Part 2 – Describe the Personal Data and how it is processed
      </Typography>
      {radio(
        "dataType",
        [
          "Employees",
          "Contractors",
          "Customer Contacts",
          "Supplier Contacts",
          "Customer’s Customer",
        ],
        "2.1 Type of Data Subject",
        defaultAlter,
        "(please tick one)"
      )}
      {checkbox(
        "personalDataTypes",
        "2.2a Types of Personal Data Processed",
        [
          "Given Names",
          "Family Name",
          "Date of Birth",
          "Age",
          "Gender",
          "Address",
          "Postcode",
          "Telephone Number",
          "Mobile Number",
          "E-mail Address",
          "Skype/IM Address",
          "IP Address",
          "NI Number",
          "Passport Number",
          "Driving License No.",
          "Employee ID",
          "Job Title",
          "Login Details",
          "Customer Number",
          "Next of Kin/ICE",
        ],
        "(tick any that apply)",
        defaultAlters
      )}
      {checkbox(
        "specialCategoryTypes",
        "2.2b Types of Special Category Personal Data to be Processed",
        [
          "Health or Medical Information",
          "Political Affiliations",
          "Religious Beliefs",
          "Racial or Ethnic Origin",
          "Trade Union Membership",
          "Sexual Life",
        ],
        "(tick any that apply)"
      )}
      {boolean(
        "criminalConvictions",
        "Will the personal data include criminal convictions or offences?"
      )}
      {checkbox(
        "highRiskTypes",
        "2.2c Other Types of High Risk Personal Data to be Processed",
        ["Financial data", "Identifiable images", "Commercially sensitive data"],
        "(tick any that apply)"
      )}
      {checkbox(
        "personalDataCollection",
        "2.3a How will the Personal Data be collected?",
        [
          "Post or By Hand",
          "E-mail",
          "Verbal in person",
          "Verbal via telephone",
          "Online portal/web page",
          "From a third party – GL UK&I as the data controller",
          "From a third party – GL UK&I as the data processor",
        ],
        "(tick all that apply)",
        defaultAlters
      )}
      {radio(
        "privacyNoticeStatus",
        ["Planned", "In Draft", "Complete & Signed Off", "Needs amending"],
        "2.3b What is the status of the Privacy Notice?",
        defaultAlter
      )}
      {textField(
        "personalDataUsage",
        "2.4a How will the Personal Data and the Special Category Personal Data be used?",
        "Describe how the personal data identified above will be processed, and for what purpose.  For example: for employee performance management, for management of commercial contracts, for payroll including PAYE"
      )}
      {textField(
        "personalDataAccuracy",
        "2.4b How will the Personal Data be kept accurate and up to date?",
        "Describe what reasonable and proportionate steps will be taken to ensure that the personal data is current and correct."
      )}
      {checkbox(
        "lawfulBasis",
        "2.4c What will the Lawful Basis of Processing be?",
        [
          "Consent (See note 1 below)",
          "Contract",
          "Legitimate Interests (See note 2 below)",
          "Legal Obligation",
          "Vital Interests",
          "Public Task",
        ],
        `Note 1: If Consent is being used as the lawful basis, describe how free and informed consent will be obtained and recorded.
        Note 2: If Legitimate Interests is being used as the lawful basis then a Legitimate Interests Assessment (LIA) must be completed and filed with this DPIA.
        Note 3: If Special Category Personal Data is to be processed (see section 2.2b), you must identify the condition under GDPR Article 9(2) that applies for the processing. Consult your DPO for guidance.
        Note 4: If personal data relating to criminal convictions or offences is to be processed (see section 2.2b) the processing must be compliant with GDPR Article 10.  Consult your DPO for guidance.`,
        defaultAlters
      )}
      {checkbox(
        "personalDataStorage",
        "2.5a How will the Personal Data be stored?",
        [
          "Filing cabinet",
          "Desk pedestal or personal locker",
          "Eclipse",
          "Applicant Tracking System",
          "SAGE (on premises)",
          "Sharepoint (ecssps01)",
          "Shared network folders",
          "Personal network folders (H:)",
          "Personal folders on laptop/PC",
          "Company mobile phone",
          "E mail filing system (O365)",
          "Teams",
          "Sharepoint (ecsemea)",
          "One Drive",
          "Dropbox",
          "Kimble",
          "Sales Cloud",
          "SAGE (cloud service)",
          "DocuSign",
        ],
        "IMPORTANT NOTE: Storing Personal Data on desks (for example, in desktop letter trays) is contrary to the Physical Security Disciplines laid out in GL UK&I’ Information Security Policy.",
        defaultAlters
      )}
      {checkbox(
        "personalDataLocation",
        "2.5b In what physical location will the Personal Data be stored?",
        ["GL UK&I offices", "Colocation site", "Cloud data centre", "Mobile device"],
        "(tick all that apply)",
        [
          {
            display: "Provide more information about the physical location",
            helperText:
              "e.g. which GL UK&I office(s), or the geographic location of the cloud data centre(s)",
          },
        ]
      )}
      {checkbox(
        "subjectDataWithinMonth",
        "2.5c Can the exercise of a Data Subject’s rights be completed within one month? ",
        [
          "Access",
          "Rectification",
          "Erasure",
          "Restriction of Processing",
          "Data Protability",
          "Objection to Processing",
        ],
        "(confirm each with a tick)",
        [
          {
            display:
              "If the answer to any of the above is no or not relevant, please provide further information",
            helperText:
              "Further relevant information/explanation can also be added here if required.",
          },
        ]
      )}
      {boolean("isAutomated", "Does the processing involve any automated decision making?")}
      {textField(
        "dataRetention",
        "2.5d How long will the Personal Data be retained?",
        "Indicate the retention period for each category of personal data that is being processed.  It may be more appropriate to express the retention period in terms of time elapsed after a certain event or condition (e.g. three years after we have last had contact with a candidate) rather than as an absolute time limit based on the data of collection/acquisition. Retention periods should be compliant with the GL UK&I Data Retention Policy."
      )}
      {textField(
        "dataDisposal",
        "2.5e How will the Personal Data be disposed of once its retention period has elapsed?",
        "Describe how the personal data will be deleted from the system or otherwise securely disposed of, including certification of secure destruction where relevant."
      )}
      {textField(
        "dataAccess",
        "2.6 Who in GL UK&I will have access to the Personal Data?",
        "Provide a list of job roles or teams"
      )}
      {boolean(
        "isTrainingRelevant",
        "Is privacy and data protection training relevant to those roles provided?"
      )}
      {boolean(
        "isTrainingWithinYear",
        "Have all staff in those roles completed the training within the last 12 months?"
      )}
      {checkbox(
        "authenticationMethods",
        "2.7a What authentication methods will be used to verify a user’s identity?",
        [
          "User name and password",
          "Secure hardware token",
          "Smart card/proximity card",
          "‘Soft’ Token",
        ],
        "(tick all that apply)",
        defaultAlters
      )}
      {checkbox(
        "monitoringData",
        "2.7b What security measures are in place to control and monitor access to the Personal Data?",
        [
          "Physically secure location",
          "Secure room/area",
          "Secure server rack",
          "Logs of access to secure locations/areas/racks",
          "Lockable cabinets/pedestals",
          "Physical key/combination management procedures",
          "Access control lists (ACLs)",
          "Role based access control (RBAC)",
          "File/record access audit logs",
          "User activity audit logs",
          "Data encrypted at rest",
          "Pseudonymisation",
        ],
        "(tick all that apply)",
        [
          {
            display: "Other (please specify)",
            helperText:
              "Where appropriate, provide additional details about the security measures ticked above, as well as any additional controls which may be deployed",
          },
        ]
      )}
      {checkbox(
        "personalDataIntegrity",
        "2.7c What controls are in place to ensure the integrity of the Personal Data?",
        [
          "RAID storage",
          "Backups stored locally",
          "Backups stored off site",
          "Transaction logs",
          "Four-eyes processes",
          "Separation of duties",
        ],
        "(tick all that apply)",
        defaultAlters
      )}
      <Typography className={classes.section}>
        2.8a Transfers of information outside of GL UK&amp;I
      </Typography>
      {boolean(
        "isDataTransferOutside",
        "Will any of the Personal Data be sent outside of GL UK&I or its computer network?"
      )}
      {boolean(
        "isController",
        "Is the transfer of Personal Data to a data controller or a data processor?",
        undefined,
        undefined,
        ["Data Controller", "Data Processor"]
      )}
      {textField("recipients", "Identify the recipient(s) of the information")}
      {checkbox(
        "transferMethod",
        "2.8b How will the Personal Data be transferred?",
        [
          "E-mail (unencrypted)",
          "E-mail (encrypted)",
          "File Transfer Protocol (FTP)",
          "Secure FTP (SFTP)",
          "Unsecured web portal (HTTP)",
          "Secure web portal (HTTPS)",
          "Unencrypted removable media",
          "Encrypted removable media",
          "Virtual Private Network (VPN)",
          "Post",
          "Fax",
          "Courier",
        ],
        "(tick all that apply)",
        [
          defaultAlter,
          {
            display: "Other controls",
            helperText:
              "Detail any additional security controls applied to the method(s) of transfer indicated above.",
          },
        ]
      )}
      <Typography className={classes.section}>
        2.8c Transfers of information outside of the European Economic Area (EEA)
      </Typography>
      {boolean(
        "isOutsideEea",
        "Are any of the recipients located outside of the European Economic Area?"
      )}
      {textField(
        "countries",
        "If Yes, you must identify here the countries to which the personal data will be transferred",
        "If No, proceed to Part 3."
      )}
      {checkbox(
        "transferConditions",
        "2.8d Conditions for the transfer of information outside of the European Economic Area",
        ["Adequacy decision", "Binding corporate rules", "Standard contract clauses"],
        undefined,
        [
          {
            display: "Other (please specify)",
            helperText:
              "You may need to consult with your DPO to determine which conditions apply.  Further relevant information/explanation can also be added here if required.",
          },
        ]
      )}
    </>
  );
};

PartTwo.displayName = "PartTwo";

export default PartTwo;
