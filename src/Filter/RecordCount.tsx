import React, { useState, useEffect } from "react";
import { CircularProgress, Typography } from "@mui/material";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";
import { dataService } from "../_services/dataService";
import { DataSource } from "../Model/iTechRestApi/DataSource";
import useIsMounted from "../_helpers/hooks/useIsMounted";
import { Alert } from '@mui/material';
import { useStyles } from "./AdvancedFilter.styles";

interface IRecordCountProps {
  dataSource: DataSource;
  dataService?: typeof dataService;
  notFilteredToCase?: boolean;
}

const RecordCount: React.FC<IRecordCountProps> = ({
  dataSource,
  dataService,
  notFilteredToCase = false,
}) => {
  // disabled if not supplied
  if (!dataService) return null;

  const classes = useStyles();

  // add random val for when multiple advanced filters displayed
  const [rowCountArea] = useState<string>(
    "advancedFilterRowCount-" + Math.floor(Math.random() * 1000)
  );
  const [rowCount, setRowCount] = useState<number | undefined>(undefined);

  const { promiseInProgress } = usePromiseTracker({ area: rowCountArea });
  const isMounted = useIsMounted();

  useEffect(() => {
    // remove this if want to query even when a filter just added and no value / or datasource witn no filters.
    // only get count when all filters have a value
    if (
      !dataSource.filters ||
      dataSource.filters.length === 0 ||
      !dataSource.filters.filter(x => x.iTechControlColumnTypeRowId !== 1).every((x) => x.value) // exlude check on booleans (checkboxes)
    ) {
      setRowCount(undefined);
      return;
    }

    const controller = new AbortController();

    trackPromise(
      dataService.queryCount(dataSource.name, [dataSource], controller.signal, notFilteredToCase),
      rowCountArea
    )
      .then((result) => {
        if (isMounted()) {
          setRowCount(result);
        }
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        if (isMounted()) {
          setRowCount(undefined);
        }
      });

    return () => {
      // cancel the request
      controller.abort();
    };
  }, [JSON.stringify(dataSource)]);

  const Data: React.FC = () => {
    if (promiseInProgress)
      return (
        <CircularProgress size={15} color="secondary" style={{ marginLeft: 5, marginBottom: 0 }} />
      );
    return <Typography variant="body2">{rowCount} results</Typography>;
  };

  return rowCount !== undefined ? (
    <div className={classes.recordCount}>
      <Alert severity="info" className={classes.alert}>
        <Data />
      </Alert>
    </div>
  ) : null;
};

RecordCount.displayName = "RecordCount";
export default RecordCount;
