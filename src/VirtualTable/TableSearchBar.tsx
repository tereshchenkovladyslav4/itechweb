import React, { useEffect, useState } from "react";
import { capitalize, toDecimal } from "../_helpers/utilities";
import { usePromiseTracker } from "react-promise-tracker";
import { iTechControlSearchEnum } from "../Model/iTechRestApi/iTechControlSearchEnum";
import { Typography } from "@mui/material";
import { useStyles } from "./TableSearchBar.styles";
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
import HighlightOff from "@mui/icons-material/HighlightOff";
import ViewColumn from "@mui/icons-material/ViewColumn";
import HideSource from "@mui/icons-material/HideSource";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import LoadingButton from "./LoadingButton";
import SearchBox from "./SearchBox";

// interface IsLoadingProps {
//   area: string;
//   percentage: string;
//   onClick(): Promise<void>;
//   isLoaded: boolean;
//   loadAllEnabled: boolean;
// }

const _buttonStyle = { height: 27, width: 27, marginTop: 5, marginLeft: 8 };
const _tooltipPlacement = "bottom";

const defaultSearchOptions = [
  {
    label: capitalize(iTechControlSearchEnum[iTechControlSearchEnum.summary]),
    searchType: iTechControlSearchEnum.summary,
    enabled: true,
  },
  {
    label: "From",
    searchType: iTechControlSearchEnum.fromAddress,
    enabled: true,
  },
  { label: "To", searchType: iTechControlSearchEnum.toAddress, enabled: true },
  {
    label: "File name",
    searchType: iTechControlSearchEnum.name,
    enabled: false,
  },
  {
    label: capitalize(iTechControlSearchEnum[iTechControlSearchEnum.body]),
    searchType: iTechControlSearchEnum.body,
    enabled: true,
  },
  {
    label: "Attachments",
    searchType: iTechControlSearchEnum.childBody,
    enabled: false,
  },
] as SearchOption[];

// const IsLoading = ({ area, onClick, percentage, isLoaded, loadAllEnabled }: IsLoadingProps) => {
//   const { promiseInProgress } = usePromiseTracker({ area: area });
//   const text = promiseInProgress ? "Loading" : percentage;

//   return (
//     <LoadingButton
//       text={text}
//       onClick={onClick}
//       isLoading={promiseInProgress}
//       isLoaded={isLoaded}
//       enabled={loadAllEnabled}
//     />
//   );
// };

interface TableSearchBarProps extends React.PropsWithChildren {
  numberOfResultsReturned: number;
  numberOfResultsFound?: number;
  onLoadResults(): Promise<void>;
  onChange(e: any): void;
  onClear(e: any): void;
  onSubmit(): void;
  toggleSearchVisibility(): void;
  isSearchVisible: boolean;
  value: string;
  area: string;
  dataSource: string;
  icon?: string;
  iconText?: string;
  onOptionsChange: (opts: iTechControlSearchEnum[]) => void;
  resultSetName?: string;
  timePeriod: number;
  setTimePeriod: (val: number) => void;
  filterGroup?: FilterGroup;
  filterModels?: Map<iTechDataWebFilterEnum, AdvancedFilterModel>;
  setFilterModels: React.Dispatch<
    React.SetStateAction<Map<iTechDataWebFilterEnum, AdvancedFilterModel> | undefined>
  >;
}

const TableSearchBar: React.FC<TableSearchBarProps> = ({
  numberOfResultsReturned,
  numberOfResultsFound,
  onLoadResults,
  onChange,
  onClear,
  onSubmit,
  toggleSearchVisibility,
  isSearchVisible,
  value,
  area,
  dataSource,
  icon,
  iconText,
  children,
  onOptionsChange,
  resultSetName,
  timePeriod,
  setTimePeriod,
  filterGroup,
  filterModels,
  setFilterModels,
}) => {
  // const percent = numberOfResultsFound
  //   ? toDecimal((numberOfResultsReturned / numberOfResultsFound) * 100, 2)
  //   : "";
  // const percentage = numberOfResultsFound !== numberOfResultsReturned ? `${percent}%` : "LOADED";
  // const numberResultsText = numberOfResultsFound !== undefined ? numberOfResultsFound : "Loading";
  const searchTooltipText = isSearchVisible ? "Hide column filter" : "Show column filter";
  //const isLoaded = numberOfResultsFound ? numberOfResultsReturned >= numberOfResultsFound : false;
  //const loadAllThreshold = 100000;
  //const loadAllEnabled = numberOfResultsFound ? numberOfResultsFound < loadAllThreshold : false;
  const classes = useStyles();
  const [searchOptions, setSearchOptions] = useState(defaultSearchOptions);
  // the tooltip for hide / show search options remains when click the button without this logic
  const [show, setShow] = useState(false);
  const { selectors } = useStore();

  const getSearchOptions = (opts: SearchOption[]) =>
    opts.filter((x) => x.enabled).map((x) => x.searchType);

  const setSearchOption = (opt: SearchOption) => {
    const newOpts = [...searchOptions];
    const option = newOpts.find((x) => x.searchType === opt.searchType);
    if (option) option.enabled = opt.enabled;
    setSearchOptions(newOpts);
    // pass back the selected options
    // onOptionsChange(getSearchOptions(newOpts));
  };

  useEffect(() => {
    onOptionsChange(getSearchOptions(searchOptions));
  }, [searchOptions]);

  const _setTimePeriod = (val: number) => {
    setTimePeriod(val); // TODO
  };

  return (
    <div className={classes.tableSearchBar}>
      <div className={classes.tableSearchArea}>
        {/* {icon && (
          <div className={classes.tableIcon}>
            <span>
              <IconManager icon={icon} />
            </span>
            {(iconText || dataSource) + (resultSetName ? ` (${resultSetName})` : "")}
          </div>
        )} */}
        <SearchBox
          placeholder="Search..."
          onChange={onChange}
          isVisible={true}
          isHorizontalTransition={true}
          value={value}
          onSubmit={onSubmit}
        />
        <div>
          <Tooltip title="Search" placement={_tooltipPlacement}>
            <IconButton
              type="submit"
              aria-label="search"
              style={_buttonStyle}
              onClick={onSubmit}
              size="large"
            >
              <SearchIcon />
            </IconButton>
          </Tooltip>
        </div>
        {dataSource === TableEnum[TableEnum.iTechWebSim] && (
          <SearchBoxOptions
            values={searchOptions}
            setValue={setSearchOption}
            iconProps={{ style: _buttonStyle }}
          />
        )}
        <div>
          <Tooltip title="Clear all filters" placement={_tooltipPlacement}>
            <IconButton
              type="submit"
              aria-label="clear"
              style={_buttonStyle}
              onClick={onClear}
              size="large"
            >
              <HighlightOff />
            </IconButton>
          </Tooltip>
        </div>
        <Tooltip
          title={searchTooltipText}
          placement={_tooltipPlacement}
          disableHoverListener
          onMouseEnter={() => setShow(true)}
          onMouseLeave={() => setShow(false)}
          open={show ?? false}
        >
          <IconButton
            type="submit"
            aria-label="search"
            style={_buttonStyle}
            onClick={() => {
              setShow(false);
              toggleSearchVisibility();
            }}
            size="large"
          >
            {isSearchVisible ? <HideSource /> : <ViewColumn />}
          </IconButton>
        </Tooltip>
      </div>
      {/* <FilterBreadCrumb dataSource={dataSource} dataSourceDescription={iconText} filterGroup={filterGroup} /> */}
      <ComponentFilterBreadCrumb
        filterModels={filterModels}
        setFilterModels={setFilterModels}
        dataSourceDescription={iconText}
        filterGroup={filterGroup}
      />
      {getDynamicDateDatasourceColumn(dataSource, selectors.getDataSources()) && (
        <div style={{ marginTop: 1, marginRight: 3 }}>
          <TimePeriodDropdown
            setValue={_setTimePeriod}
            value={timePeriod}
            style={{ minWidth: 86 }}
          />
        </div>
      )}
      {/* <div className={classes.tableSearchResults}>
        <div className={classes.loadingBtn}>{children}</div>
        {numberOfResultsFound !== numberOfResultsReturned && ( // TODO: put timer on this
          <IsLoading
            percentage={percentage}
            onClick={onLoadResults}
            isLoaded={isLoaded}
            loadAllEnabled={loadAllEnabled}
            area={area}
          />
        )}
        <Typography className={classes.tableSearchText}>{`${numberResultsText} ${
          numberResultsText === 1 ? "Result" : "Results"
        }`}</Typography>
      </div> */}
    </div>
  );
};

export default TableSearchBar;
