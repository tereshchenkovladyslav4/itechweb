import React, { useEffect, useState } from "react";
import { capitalize, toDecimal } from "../_helpers/utilities";
import { usePromiseTracker } from "react-promise-tracker";
import { iTechControlSearchEnum } from "../Model/iTechRestApi/iTechControlSearchEnum";
import { Typography } from "@mui/material";
import { useStyles } from "./TableFooterBar.styles";
import { TableEnum } from "../Model/iTechRestApi/TableEnum";
import { getDynamicDateDatasourceColumn } from "../_helpers/helpers";
import { useStore } from "../_context/Store";
import { FilterGroup } from "../Model/Types/FilterGroup";
import { AdvancedFilterModel } from "../Model/iTechRestApi/AdvancedFilterModel";
import { iTechDataWebFilterEnum } from "../Model/iTechRestApi/iTechDataWebFilterEnum";
import IconManager from "../_components/IconManager";
import SearchBoxOptions, { SearchOption } from "./SearchBoxOptions";
import TimePeriodDropdown from "../_components/TimePeriodDropdown";
import ComponentFilterBreadCrumb from "../Filter/ComponentFilterBreadCrumb";
import SearchIcon from "@mui/icons-material/Search";
import ArrowLeft from "@mui/icons-material/ArrowLeft";
import HighlightOff from "@mui/icons-material/HighlightOff";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import LoadingButton from "./LoadingButton";
import SearchBox from "./SearchBox";

interface IsLoadingProps {
  area: string;
  percentage: string;
  onClick(): Promise<void>;
  isLoaded: boolean;
  loadAllEnabled: boolean;
}

const IsLoading = ({ area, onClick, percentage, isLoaded, loadAllEnabled }: IsLoadingProps) => {
  const { promiseInProgress } = usePromiseTracker({ area: area });
  const text = promiseInProgress ? "Loading" : percentage;

  return (
    <LoadingButton
      text={text}
      onClick={onClick}
      isLoading={promiseInProgress}
      isLoaded={isLoaded}
      enabled={loadAllEnabled}
    />
  );
};

interface TableFooterBarProps extends React.PropsWithChildren {
  numberOfResultsReturned: number;
  numberOfResultsFound?: number;
  onLoadResults(): Promise<void>;
  area: string;
}

const TableFooterBar: React.FC<TableFooterBarProps> = ({
  numberOfResultsReturned,
  numberOfResultsFound,
  onLoadResults,
  area,
  children,
}) => {
  const percent = numberOfResultsFound
    ? toDecimal((numberOfResultsReturned / numberOfResultsFound) * 100, 2)
    : "";
  const percentage = numberOfResultsFound !== numberOfResultsReturned ? `${percent}%` : "LOADED";
  const numberResultsText = numberOfResultsFound !== undefined ? numberOfResultsFound : "Loading";
  const isLoaded = numberOfResultsFound ? numberOfResultsReturned >= numberOfResultsFound : false;
  const loadAllThreshold = 100000;
  const loadAllEnabled = numberOfResultsFound ? numberOfResultsFound < loadAllThreshold : false;
  const classes = useStyles();

  return (
    <div className={classes.tableFooter}>
      <div className={classes.loadingBtn}>{children}</div>
      <div className={classes.resultsText}>
        {numberOfResultsFound !== numberOfResultsReturned && ( // TODO: put timer on this
          <IsLoading
            percentage={percentage}
            onClick={onLoadResults}
            isLoaded={isLoaded}
            loadAllEnabled={loadAllEnabled}
            area={area}
          />
        )}
        <Typography>{`${numberResultsText} ${
          numberResultsText === 1 ? "Result" : "Results"
        }`}</Typography>
      </div>
    </div>
  );
};

export default TableFooterBar;
