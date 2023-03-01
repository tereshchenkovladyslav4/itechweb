import { Button, FormLabel, Portal, Typography } from "@mui/material";
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { Add, Cancel } from "@mui/icons-material";
import { Alert } from '@mui/material';
import React, { ReactElement, useState, useRef } from "react";
import { trackPromise } from "react-promise-tracker";
import UserSearch, { SearchDataType } from "../Filter/UserSearch";
import FormBuilder from "../Form/FormBuilder";
import { ITechWebLexiconGroup } from "../Model/iTechRestApi/ITechWebLexiconGroup";
import BusyButton from "../_components/BusyButton";
import { lexiconGroupService } from "../_services/lexiconGroupService";

const useStyles = makeStyles(() =>
  createStyles({
    formButton: {
      margin: "0 0 24px 24px",
    },
    header: {
      margin: "20px 30px",
    },
    label: {
      margin: "10px 0",
    },
  })
);

type AddToLexiconGroupProps = {
  onCloseForm: () => void;
  rowIds: number[];
};

const AddToLexiconGroup: React.FC<AddToLexiconGroupProps> = ({ onCloseForm, rowIds }) => {
  const [group, setGroup] = useState<ITechWebLexiconGroup | undefined>();
  const [error, setError] = useState<string>("");
  const area = "AddToLexiconGroupSaveBtn";
  const classes = useStyles();

  const saveToCase = () => {
    if (rowIds.length === 0) {
      setError("No phrases selected");
      return;
    }
    if (!group) {
      setError("No lexicon group selected");
      return;
    }

    trackPromise(lexiconGroupService.addReferences(group.gid, rowIds), area).then(
      () => {
        setGroup(undefined);
        onCloseForm();
      },
      (error) => setError(error)
    );
  };

  return (
    <>
      <div className={classes.header}>
        <Typography variant="h4">Add Phrase(s) to Lexicon</Typography>
      </div>

      <div>
        {error && <Alert severity="error">{error}</Alert>}

        <div className="formSection">
          <FormLabel component="legend" className={classes.label}>
            Find Lexicon
          </FormLabel>
          <UserSearch
            datatype={SearchDataType.LexiconGroup}
            value={group ? group : ""}
            setValue={(val) => setGroup(val)}
            isLogin={false}
          />
        </div>
        <BusyButton
          className={classes.formButton}
          onClick={saveToCase}
          area={area}
          disabled={!group || rowIds?.length === 0}
          startIcon={<Add />}
        >
          Add
        </BusyButton>
        <Button
          className={classes.formButton}
          onClick={() => {
            onCloseForm();
            setError("");
            setGroup(undefined);
          }}
          startIcon={<Cancel />}
        >
          Cancel
        </Button>
      </div>
    </>
  );
};

type AddToLexiconGroupDlgProps = {
  show: boolean;
  setShow: (show: boolean) => void;
  rowIds: number[];
};

const AddToLexiconGroupDlg: React.FC<AddToLexiconGroupDlgProps> = ({
  show,
  setShow,
  rowIds,
}): ReactElement => {
  const container = useRef();

  return (
    <Portal container={container.current}>
      <FormBuilder propDisplay={show} onChange={setShow}>
        <AddToLexiconGroup onCloseForm={() => setShow(false)} rowIds={rowIds} />
      </FormBuilder>
    </Portal>
  );
};

export default AddToLexiconGroupDlg;
