import { Button, Portal, Typography } from "@mui/material";
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { Add, Cancel } from "@mui/icons-material";
import { Alert } from '@mui/material';
import React, { ReactElement, useState, useRef } from "react";
import { trackPromise } from "react-promise-tracker";
import { AdvancedFilterSub } from "../Filter/AdvancedFilter";
import FormBuilder from "../Form/FormBuilder";
import { Filter } from "../Model/iTechRestApi/Filter";
import { IAddToCase } from "../Model/iTechRestApi/ICaseData";
import BusyButton from "../_components/BusyButton";
import { RefreshTableEvent, trigger } from "../_helpers/events";
import { caseService } from "../_services/caseService";

const useStyles = makeStyles(() =>
  createStyles({
    formButton: {
      margin: "10px 0 24px 24px",
    },
    header: {
      margin: "20px 30px",
    },
  })
);

type AddToCaseProps = {
  onCloseForm: () => void;
  dataSource: string;
  iTechControlTableRowId: number;
  show: boolean;
  service: typeof caseService;
};

const AddToCaseFilter: React.FC<AddToCaseProps> = ({
  onCloseForm,
  dataSource,
  iTechControlTableRowId,
  show,
  service,
}) => {
  const [currentFilterSet, setCurrentFilterSet] = useState<any>({});
  const [error, setError] = useState<string>();
  const area = "AddToCaseFilterSaveBtn";
  const classes = useStyles();

  const saveToCase = () => {
    setError(undefined);
    const caseId = sessionStorage.getItem("caseId"); // could just get this from header in server rather than as part of message

    const request = {
      caseId: Number(caseId),
      expressions: currentFilterSet.dataSources,
      iTechControlTableRowId: iTechControlTableRowId,
    } as IAddToCase;

    trackPromise(service.addItems(request), area).then((result) => {
      if (result.error) {
        setError(result.error);
      } else {
        onCloseForm();
        trigger(RefreshTableEvent, { dataSource: dataSource });
      }
    });
  };

  return (
    <>
      <div className={classes.header}>
        <Typography style={{ fontWeight: "bold" }}>Add Item(s) to Case</Typography>
      </div>

      <AdvancedFilterSub
        data={{}}
        area={"surveillance"}
        tabId={0}
        currentFilterSet={currentFilterSet}
        setCurrentFilterSet={setCurrentFilterSet}
        loaded={show}
        ignoreCaseForRowCount={true}
        dataSource={dataSource}
      />
      <div>
        {error && <Alert severity="error">{error}</Alert>}
        <BusyButton
          className={classes.formButton}
          onClick={saveToCase}
          area={area}
          disabled={
            !currentFilterSet?.dataSources ||
            currentFilterSet.dataSources[0]?.filters?.length === 0 ||
            currentFilterSet.dataSources[0]?.filters?.some((x: Filter) => !x.value)
          }
          startIcon={<Add />}
        >
          Add
        </BusyButton>
        <Button
          variant="contained"
          color="primary"
          className={classes.formButton}
          onClick={() => {
            onCloseForm();
            setCurrentFilterSet({});
          }}
          startIcon={<Cancel />}
        >
          Cancel
        </Button>
      </div>
    </>
  );
};

type AddToCaseFilterDlgProps = {
  show: boolean;
  setShow: (show: boolean) => void;
  dataSource: string;
  iTechControlTableRowId: number;
};

const AddToCaseFilterDlg: React.FC<AddToCaseFilterDlgProps> = ({
  show,
  setShow,
  dataSource,
  iTechControlTableRowId,
}): ReactElement => {
  const container = useRef();

  return (
    <Portal container={container.current}>
      <FormBuilder propDisplay={show} onChange={setShow}>
        <AddToCaseFilter
          onCloseForm={() => setShow(false)}
          dataSource={dataSource}
          iTechControlTableRowId={iTechControlTableRowId}
          show={show}
          service={caseService}
        />
      </FormBuilder>
    </Portal>
  );
};

export default AddToCaseFilterDlg;
