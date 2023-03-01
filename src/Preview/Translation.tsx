import { Button, Grid, MenuItem, Select } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import React, { useState, useEffect } from "react";
import SDLMTLanguages from "../Model/Types/SDLMTLanguages";
import useIsMounted from "../_helpers/hooks/useIsMounted";
import { translationService } from "../_services/translationService";

const useStyles = makeStyles(() => ({
  select: {
    maxWidth: 300,
    margin: "0 20px",
  },
  button: {
    margin: "0 20px",
  },
  error: {
    color: "Red",
    padding: "10px 20px",
  },
  translate: {
    padding: "10px 20px",
  },
}));

interface ITranslationProps {
  rowId: number;
}

const Translation: React.FC<ITranslationProps> = ({ rowId }: ITranslationProps) => {
  const classes = useStyles();
  const defaultSelection = "default";
  const [languages, setLanguages] = useState<SDLMTLanguages>();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(defaultSelection);
  const [translation, setTranslation] = useState<string>();
  const [error, setError] = useState<string>();
  const isMounted = useIsMounted();

  useEffect(() => {
    if (!rowId) return;

    translationService
      .languages()
      .then((result) => {
        if (!isMounted()) return;
        setLanguages(result);
      })
      .catch((error) => {
        console.error(error);
      });
    setTranslation("");
    setError("");
    setSelectedLanguage(defaultSelection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowId]);

  function removeDuplicates(myArr: any[] | undefined, prop: string) {
    if (!myArr) return [];
    return myArr.filter((obj, pos, arr) => {
      return arr.map((mapObj) => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }

  const loadLanguage = (lang: string) => {
    translationService
      .sim(rowId, lang)
      .then((result) => {
        setTranslation(result.text);
        setError(result.error);
      })
      .catch((error) => {
        setError(error);
        setTranslation("");
      });
  };

  const languageSelection = removeDuplicates(languages?.languagePairs, "targetLanguageId");
  return (
    <>
      <Grid xs={12} container item>
        {languageSelection.length > 1 ? (
          <Select
            labelId="challengeLabel"
            id="challengeSelect"
            onChange={(e: any) => setSelectedLanguage(e.target.value)}
            value={selectedLanguage}
            // displayEmpty
            className={classes.select}
          >
            <MenuItem key={defaultSelection} value={defaultSelection}>
              Translate
            </MenuItem>
            {languageSelection?.map((pair) => {
              return (
                <MenuItem
                  key={pair.languagePairId}
                  value={pair.languagePairId}
                  onClick={() => loadLanguage(pair.targetLanguageId)}
                >
                  {pair.targetLanguage}
                </MenuItem>
              );
            })}
          </Select>
        ) : languageSelection.length === 1 ? (
          <Button
            className={classes.button}
            onClick={() => loadLanguage(languageSelection[0].targetLanguageId)}
          >
            Translate to {languageSelection[0].targetLanguage}
          </Button>
        ) : null}
      </Grid>

      {translation ? (
        <Grid xs={12} container item className={classes.translate}>
          {translation}
        </Grid>
      ) : null}

      {error ? (
        <Grid xs={12} container item className={classes.error}>
          {error}
        </Grid>
      ) : null}
    </>
  );
};

export default Translation;
