import { Button, Grid, MenuItem, Select } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import React, { useState, useEffect } from "react";
import { Country } from "../Model/iTechRestApi/Country";
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

const GoogleTranslate: React.FC<ITranslationProps> = ({ rowId }: ITranslationProps) => {
  const classes = useStyles();
  const defaultSelection = "-1";
  const [languages, setLanguages] = useState<Country[]>();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(defaultSelection);
  const [translation, setTranslation] = useState<string>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!rowId) return;

    translationService
      .googlelanguages()
      .then((result) => {
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

  const loadLanguage = (lang: string) => {
    translationService
      .googlesim(rowId, lang)
      .then((result) => {
        console.log(result.text);
        setTranslation(result.text);
        setError(result.error);
      })
      .catch((error) => {
        setError(error);
        setTranslation("");
      });
  };

  return (
    <>
      <Grid xs={12} container item>
        {languages && languages?.length > 1 ? (
          <Select
            labelId="challengeLabel"
            id="challengeSelect"
            onChange={(e: any) => setSelectedLanguage(e.target.value)}
            value={selectedLanguage}
            // displayEmpty
            placeholder="Translate"
            className={classes.select}
          >
            <MenuItem key={defaultSelection} value={defaultSelection}>
              Translate
            </MenuItem>
            {languages
              ?.sort((a, b) => a.name.localeCompare(b.name))
              .map((pair) => {
                return (
                  <MenuItem
                    key={pair.code}
                    value={pair.name}
                    onClick={() => loadLanguage(pair.code)}
                  >
                    {pair.name}
                  </MenuItem>
                );
              })}
          </Select>
        ) : languages?.length === 1 ? (
          <Button className={classes.button} onClick={() => loadLanguage(languages[0].code)}>
            Translate to {languages[0].name}
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

export default GoogleTranslate;
