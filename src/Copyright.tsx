import React from "react";
import { Typography, Link } from "@mui/material";

function Copyright() {
  return (
    <Typography variant="body2" color="primary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://insightfultechnology.com/">
        Soteria
      </Link>{" "}
      {new Date().getFullYear()}
    </Typography>
  );
}

export default Copyright;
