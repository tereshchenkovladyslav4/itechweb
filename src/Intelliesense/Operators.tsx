import React, { useState } from "react";
import { Button, Switch, TextField, Tooltip, Typography } from "@mui/material";
import { operators, _queryId } from "./types";

interface IOperatorsProps {
  setValue(value: string): void;
}

const Operators: React.FC<IOperatorsProps> = ({ setValue }) => {
  const [proximity, setProximity] = useState("1");
  const [boundary, setBoundary] = useState(false);

  const _setProximity = (val: string) => {
    const value = Number(val);
    if (value <= 10 && value > 0) {
      setProximity(val);
    }
  };

  const onClick = (val: string) => {
    setValue(val + "~" + proximity + (boundary ? "P" : ""));
    const query = document.getElementById(_queryId);
    query?.focus();
  };

  function handleSwitchChange() {
    setBoundary((prev) => !prev);
  }

  return (
    <div>
      {operators.map((op, i) => (
        <Operator key={i} text={op.text} description={op.description} onClick={onClick} />
      ))}
      <TextField
        label="Proximity"
        style={{ width: 80, marginRight: 25, marginBottom: 5, marginTop: 3 }}
        size="small"
        type="number"
        value={proximity}
        onChange={(e) => _setProximity(e.target.value)}
      />

      <Typography component="label">Word</Typography>
      <Switch checked={boundary} onChange={handleSwitchChange} color="primary" />
      <Typography component="label">Paragraph</Typography>
    </div>
  );
};

interface IOperatorProps {
  text: string;
  description: string;
  onClick(val: string): void;
}

const Operator: React.FC<IOperatorProps> = ({ text, description, onClick }) => {
  const click = () => onClick(text);

  return (
    <div style={{ display: "inline-flex", flexDirection: "row" }}>
      <Tooltip title={description} placement="top">
        <Button onClick={click} size="small" style={{ margin: "10px 10px 0 0", height: "2em" }}>
          {text}
        </Button>
      </Tooltip>
    </div>
  );
};

Operators.displayName = "Operators";

export default Operators;
