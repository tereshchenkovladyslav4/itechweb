import React, { useEffect } from "react";
import { Switch, Typography } from "@mui/material";

const ToggleTheme = ({ theme, toggleTheme }) => {
  const [state, setState] = React.useState(false);
  let text;

  useEffect(() => {
    if (theme === "light") {
      setState(false);
    } else {
      setState(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  function handleSwitchChange() {
    toggleTheme();
  }

  if (theme === "light") {
    text = "Light Mode";
  } else {
    text = "Dark Mode";
  }

  return (
    <Typography variant="body1">
      {text}
      <Switch checked={state} onChange={handleSwitchChange} />
    </Typography>
  );
};

export default ToggleTheme;
