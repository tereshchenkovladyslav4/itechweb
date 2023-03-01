import React, { ReactElement, useEffect, useState } from "react";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
} from "@mui/material";
import { taskService } from "../../_services/taskService";
import { trackPromise } from "react-promise-tracker";
import { useStore } from "../../_context/Store";
import { RefreshTableEvent, trigger } from "../../_helpers/events";
import BusyButton from "../../_components/BusyButton";
import useIsMounted from "../../_helpers/hooks/useIsMounted";
import ActionChips from "../ActionChips/ActionChips";

type SelectDataSourcesProps = {
  area: string;
  disabled?: boolean;
};

const SelectDataSources: React.FC<SelectDataSourcesProps> = ({
  area,
  disabled = false,
}): ReactElement => {
  const dataSources = [
    { description: "Accident", id: 8 },
    { description: "Archive", id: 7 },
    { description: "Hcl Websphere", id: 6 },
    { description: "Salesforce", id: 10 },
  ];
  // const dataSources = [
  //   { description: "VolBroker", id: 19 },
  //   { description: "BB AIM", id: 21 },
  //   { description: "Broker Suite Energy", id: 20 },
  //   { description: "Archive", id: 7 },
  // ];
  // const dataSources = [
  //   { description: "Comms", id: 7 },
  //   { description: "Orders", id: 28}
  // ];
  const isMounted = useIsMounted();

  const initialState = () => {
    return Object.assign({}, ...dataSources.map((s) => ({ [s.description]: false })));
  };
  const [state, setState] = useState(initialState());
  const [error, setError] = useState("");
  const { selectors } = useStore();

  useEffect(() => {
    taskService.getDataSources().then((results) => {
      if (isMounted()) {
        results.forEach((result) => {
          const desc = dataSources.find((d) => d.id === result)?.description;
          if (!desc) return;
          const prop = { [desc]: true };
          setState((prev: any) => ({ ...prev, ...prop }));
        });
      }
    });
  }, [selectors.getSelectedGridRow()]);

  const _onActionClick = () => {
    const selectedItem = selectors.getSelectedGridRow();
    if (selectedItem?.rowId) {
      const selected: number[] = [];
      dataSources.forEach((s) => {
        if (state[s.description]) selected.push(s.id);
      });
      return trackPromise(taskService.setDataSources(selectedItem.rowId, selected), area).then(
        () => trigger(RefreshTableEvent),
        (error) => setError(error)
      );
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const prop = { [event.target.name]: event.target.checked };
    setError("");
    setState((prev: any) => ({ ...prev, ...prop }));
  };

  return (
    <Box m={1}>
      <ActionChips />
      <FormHelperText error={true}>{error}</FormHelperText>
      <FormControl required component="fieldset">
        <FormLabel component="legend">Select data source(s):</FormLabel>
        <FormGroup style={{ marginLeft: 10 }}>
          {dataSources.map((s) => (
            <FormControlLabel
              key={s.id}
              control={
                <Checkbox
                  checked={state[s.description]}
                  onChange={handleChange}
                  name={s.description}
                  disabled={disabled}
                />
              }
              label={s.description}
            />
          ))}
        </FormGroup>
        <BusyButton
          variant="contained"
          onClick={() => _onActionClick()}
          area={area}
          disabled={disabled}
        >
          Confirm
        </BusyButton>
      </FormControl>
    </Box>
  );
};

SelectDataSources.displayName = "SelectDataSources";

export default SelectDataSources;
