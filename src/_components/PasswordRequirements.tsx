import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import makeStyles from '@mui/styles/makeStyles';
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";

const useStyles = makeStyles(() => ({
  requirements: {
    fontSize: 14,
    lineHeight: 1.4,
    marginBottom: 20,
  },
  expanded: {
    "&$expanded": {
      margin: "0",
    },
  },
}));

const PasswordRequirements: React.FC = () => {
  const classes = useStyles();
  return (
    <Accordion className={classes.requirements}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
        classes={{ expanded: classes.expanded }}
      >
        <Typography>Password Requirements</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <List>
          <ul>
            <li>
              Not contain the user&rsquo;s account name or parts of the user&rsquo;s full name that
              exceed two consecutive characters
            </li>
            <li>Not be the same as any previous passwords on this user account</li>
            <li>Be at least eight characters in length</li>
            <li>
              Contain characters from three of the following four categories:
              <ul>
                <li>English uppercase characters (A through Z)</li>
                <li>English lowercase characters (a through z)</li>
                <li>Base 10 digits (0 through 9)</li>
                <li>Non-alphabetic characters (for example, !, $, #, %)</li>
              </ul>
            </li>
          </ul>
        </List>
      </AccordionDetails>
    </Accordion>
  );
};

export default PasswordRequirements;
