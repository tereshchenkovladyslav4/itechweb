import React, { ReactElement, useState, useRef, useEffect } from "react";
import { Button, Typography, Portal, FormLabel } from "@mui/material";
import { TextField } from "@mui/material";
import { CheckCircle, Cancel, AddCircle } from "@mui/icons-material";
import FormBuilder from "../Form/FormBuilder";
import { lexiconService } from "../_services/lexiconService";
import { Lexicon } from "../Model/iTechRestApi/Lexicon";
import { useStyles } from "./AddLexiconDlg.styles";
import { TinyButton } from "../_components/TinyButton";
import { Alert } from '@mui/material';

type AddLexiconProps = {
  onFormSave: (term: Lexicon) => Promise<void>;
  onFormRemove: (lexicon: Lexicon, alternative: Lexicon) => Promise<void>;
  onCloseForm: () => void;
  gid?: string | number;
};

const AddLexicon: React.FC<AddLexiconProps> = ({ onFormSave, onFormRemove, onCloseForm, gid }) => {
  const classes = useStyles();
  const _buildLexicon = (phrase = "") => {
    const lexicon = new Lexicon();
    lexicon.phrase = phrase;
    lexicon.groups = [];
    return lexicon;
  };
  const [lexicon, setLexicon] = useState<Lexicon>(_buildLexicon());
  const [alternative, setAlternative] = useState<string>("");
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    if (gid === undefined) {
      setLexicon(_buildLexicon());
      return;
    }

    _load(gid);
  }, [gid]);

  const _load = (gid: string | number) => {
    (async () => {
      setErrorText("");
      setAlternative("");
      const lex = (await lexiconService.getLexicon(gid)) as Lexicon;
      setLexicon(lex);
    })();
  };

  const _onSubmit = () => {
    if (lexicon.phrase?.length > 0) {
      onFormSave(lexicon).then(
        () => {
          setErrorText("");
          setAlternative("");
          setLexicon(_buildLexicon());
        },
        (error) => setErrorText(error)
      );
    } else {
      setErrorText("Need a valid phrase");
    }
  };

  const _onAddAlt = () => {
    if (alternative?.length === 0) {
      setErrorText("Need a valid phrase");
    } else if (
      lexicon.groups.findIndex((x) => x.phrase.toLowerCase() === alternative.toLowerCase().trim()) >
      0
    ) {
      setErrorText("Alternative exists!");
    } else {
      setLexicon((prev) => ({ ...prev, groups: [...prev.groups, _buildLexicon(alternative)] }));
      setAlternative("");
    }
  };

  const setValue = (key: keyof Lexicon) => {
    return (e: any) => {
      const val = (
        e.target?.checked !== undefined && e.target.type === "checkbox"
          ? e.target.checked
          : e.target?.value !== undefined
          ? e.target.value
          : e
      ) as never;
      setLexicon((prev) => {
        const lex = { ...prev };
        lex[key] = val;
        return lex;
      });
    };
  };

  const _onRemove = (alternative: Lexicon, index: number) => {
    return () => {
      if (alternative.gid && lexicon.gid)
        onFormRemove(lexicon, alternative).then(null, (error) => setErrorText(error));
      const groups = [...lexicon.groups];
      groups.splice(index, 1);
      setLexicon((prev) => ({ ...prev, groups: groups }));
    };
  };

  return (
    <form autoComplete="off">
      <div className="formSection">
        <Typography>{lexicon.gid === undefined ? "Create" : "Edit"} Lexicon</Typography>
        {errorText?.length > 0 && <Alert severity="error">{errorText}</Alert>}
      </div>
      <div className="formSection">
        <TextField
          name="phrase"
          label="Phrase"
          value={lexicon.phrase ?? ""}
          onChange={setValue("phrase")}
        />
      </div>

      <div className="formSection">
        <TextField
          name="alternative"
          label="Add Alternative"
          value={alternative ?? ""}
          onChange={(e) => setAlternative(e.target.value)}
        />
        <Button className={classes.formButton} onClick={_onAddAlt}>
          <AddCircle /> Add
        </Button>

        {lexicon.groups?.length > 0 && (
          <>
            <FormLabel component="legend">Alternative Phrases</FormLabel>
            <div className={classes.groups}>
              {lexicon.groups?.map((lex, i) => (
                <Typography key={i} className={classes.group}>
                  {lex.phrase}
                  <TinyButton
                    icon="Remove"
                    onClick={_onRemove(lex, i)}
                    style={{ marginLeft: 10 }}
                  />
                </Typography>
              ))}
            </div>
          </>
        )}
      </div>
      <Button className={classes.formButton} onClick={_onSubmit}>
        <CheckCircle /> Confirm
      </Button>
      <Button className={classes.formButton} onClick={() => onCloseForm()}>
        <Cancel /> Cancel
      </Button>
    </form>
  );
};

type AddTermDlgProps = {
  show: boolean;
  setShow: (show: boolean) => void;
  onSave: (phrase: Lexicon) => Promise<void>;
  onRemove: (lexicon: Lexicon, alternative: Lexicon) => Promise<void>;
  gid?: string | number;
};

const AddLexiconDlg: React.FC<AddTermDlgProps> = ({
  show,
  setShow,
  onSave,
  onRemove,
  gid,
}): ReactElement => {
  const container = useRef();

  return (
    <Portal container={container.current}>
      <FormBuilder propDisplay={show} onChange={setShow}>
        <AddLexicon
          onFormSave={onSave}
          onFormRemove={onRemove}
          onCloseForm={() => setShow(false)}
          gid={gid}
        />
      </FormBuilder>
    </Portal>
  );
};

export default AddLexiconDlg;
