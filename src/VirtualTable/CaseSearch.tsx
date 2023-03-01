import React, { useEffect, useState } from "react";
import { Autocomplete } from '@mui/material';
import { createFilterOptions } from '@mui/material/useAutocomplete';
import { CaseSummary } from "../Model/iTechRestApi/CaseSummary";
import { caseService } from "../_services/caseService";
import { CircularProgress, TextField, Typography } from "@mui/material";
import IconManager from "../_components/IconManager";
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  labelIcon: {
    marginRight: theme.spacing(1),
    color: theme.palette.grey[600],
  },
  colName: {
    minWidth: 200,
  },
  colText: {
    marginLeft: theme.spacing(1),
  },
}));

interface CaseSearchProps {
  text: string;
  caseService: typeof caseService;
  setSelectedCase(selected: CaseSummary | null): void;
}

const CaseSearch: React.FC<CaseSearchProps> = ({ text, caseService, setSelectedCase }) => {
  const [cases, setCases] = useState<CaseSummary[]>([]);
  const [searchText, setSearchText] = useState<string>(text);
  const [open, setOpen] = useState(false);
  const loading = open && cases.length === 0 && searchText?.length > 0;
  const classes = useStyles();

  useEffect(() => {
    if (!searchText) return;

    let isMounted = true;
    if (caseService) {
      (async () => {
        const result = await caseService.search(searchText);
        if (isMounted) {
          setCases(result?.results || []);
          setSearchText("");
        }
      })();
    }
    return () => {
      isMounted = false;
    };
  }, [searchText]);

  useEffect(() => {
    if (!open) {
      setCases([]);
    }
  }, [open]);

  const filterOptions = createFilterOptions({
    matchFrom: "any",
    stringify: (option: CaseSummary) => option.name + " " + option.caseReference, // so we dont have to have option label as opt.name + ' / ' + opt.caseReference
  });

  return (
    <Autocomplete
      filterOptions={filterOptions}
      options={cases}
      loading={loading}
      style={{ width: 400 }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
        setSearchText("");
      }}
      getOptionLabel={(opt) => opt.name}
      isOptionEqualToValue={(option, value) => option.rowId === value.rowId}
      renderOption={(props, opt) => (
        <li {...props}>
          <IconManager icon={opt.icon} className={classes.labelIcon} />
          <Typography noWrap>
            <div className={classes.colName}>{opt.name}</div>
            <span>
              <small>ref: </small>
              {opt.caseReference}
            </span>
            <span className={classes.colText}>
              <small>created: {opt.dateCreated}</small>
            </span>
          </Typography>
        </li>
      )}
      onChange={(e, newVal) => setSelectedCase(newVal)}
      renderInput={(params) => (
        <TextField
          label="Case Name / Ref"
          autoFocus
          placeholder="Find case"
          onChange={(e) => setSearchText(e.target.value)}
          {...params}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
};

export default CaseSearch;
