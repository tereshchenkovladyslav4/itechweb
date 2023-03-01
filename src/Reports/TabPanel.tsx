import { Box } from "@mui/material";
import React from "react";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
    minWidth?: number | string;
  }
  
export default function TabPanel(props: TabPanelProps) {
    const { children, value, index, minWidth, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        style={{ minWidth: minWidth, height: "100%" }}
        {...other}
      >
        {value === index && <Box height={"100%"}>{children}</Box>}
      </div>
    );
  }
  