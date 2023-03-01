import { Box, Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import React, { useEffect, useState } from "react";
import { trackPromise } from "react-promise-tracker";
import { AdvancedFilterModel } from "../Model/iTechRestApi/AdvancedFilterModel";
import { filterService } from "../_services/filterService";
import FilterPopover from "../_components/FilterPopover";
import { useStore } from "../_context/Store";
// import { CounterLinkType } from "../Model/iTechRestApi/CounterLinkType";
import { getAdvancedFilter } from "../_helpers/filter";
import useAsyncError from "../_helpers/hooks/useAsyncError";
import useIsMounted from "../_helpers/hooks/useIsMounted";
// import TimePeriodDropdown from "../_components/TimePeriodDropdown";
import { Filter } from "../Model/iTechRestApi/Filter";
import { getDynamicDateDatasourceColumn } from "../_helpers/helpers";
import { iTechControlColumnEnum } from "../Model/iTechRestApi/iTechControlColumnEnum";
import { dataService } from "../_services/dataService";
import _ from "lodash";
import LoadingSpinner from "../_components/LoadingSpinner";

const useStyles = makeStyles((theme) => ({
  display: {
    paddingTop: "2vh",
    textAlign: "center",
    backgroundColor: theme.palette.background.paper,
    height: "calc(100% - 2vh)",
  },
  timePeriod: {
    minWidth: 120,
    width: 180,
    // position: "absolute",
    zIndex: 2,
    // left: 10,
    // top: 3,
    marginLeft: 8,
  },
  hover: {
    cursor: "help",
  },
}));

interface ICounterProps {
  data: any;
  service: typeof dataService;
  area: string;
  updateData(arg: any): any;
}

const Counter: React.FC<ICounterProps> = ({ data, service, area, updateData }) => {
  const classes = useStyles();
  const throwError = useAsyncError();
  const isMounted = useIsMounted();
  const [count, setCount] = useState<number>();
  const [anchorEl, setAnchorEl] = useState(null);
  const [filter, setFilter] = useState<AdvancedFilterModel | null>(null);
  const [filterDivisor, setFilterDivisor] = useState<AdvancedFilterModel | null>(null);
  const { selectors } = useStore();
  const [timePeriod, setTimePeriod] = useState(getDefaultTimePeriod(data.data)); // this functionality commented out for now

  const handlePopoverOpen = (e: any) => {
    setAnchorEl(e.target);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  function getDefaultTimePeriod(data: any): number {
    return data?.localFilters?.find((x: any) => x.operation === "After")?.value || 0;
  }

  function AddTimePeriodFilter(timePeriod: number, data: any): void {
    const dataSource = filter?.dataSources[0].name;
    if (!dataSource) return;

    const columnName = getDynamicDateDatasourceColumn(dataSource, selectors.getDataSources());
    if (!columnName) return;
    const timePeriodFilter = {
      value: timePeriod === 0 ? "" : timePeriod,
      name: columnName,
      operation: "After",
      iTechControlColumnTypeRowId: iTechControlColumnEnum.dateTime,
    } as Filter;

    if (data?.localFilters) {
      data.localFilters = [
        ...data.localFilters.filter((x: Filter) => x.name !== timePeriodFilter.name),
        timePeriodFilter,
      ];
    } else {
      data.localFilters = [timePeriodFilter];
    }
  }

  useEffect(() => {
    // load the filter
    filterService.get(data.data.filterId).then((rsp) => {
      // Don't error if this fails as its just the hover filter content
      if (isMounted()) {
        const filter = getAdvancedFilter(rsp);
        setFilter(filter);
      }
    });

    if (data?.data?.divisorFilterId && data?.data?.divisorFilterId !== -1) {
      filterService.get(data.data.divisorFilterId).then((rsp) => {
        // Don't error if this fails as its just the hover filter content
        if (isMounted()) {
          const filter = getAdvancedFilter(rsp);
          setFilterDivisor(filter);
        }
      });
    }
  }, [data?.data?.filterId]);

  useEffect(() => {
    if (!filter) return;
    // const caseId = selectors.getSelectedCaseId();
    setCount(undefined);
    AddTimePeriodFilter(timePeriod, data.data);

    // todo - check if data.data.localFilter value changed
    if (updateData) {
      updateData(data);
    }
    const controller = new AbortController();

    let count: number;
    let divisorCount: number;
    const promises = [];

    promises.push(
      service
        .queryCount(filter.dataSources[0].name, filter.dataSources, controller.signal, false)
        .then((result) => {
          count = result;
        })
    );

    if (data.data.isPercentage) {
      const controller2 = new AbortController();
      if (filterDivisor) {
        promises.push(
          trackPromise(
            service.queryCount(
              filterDivisor.dataSources[0].name,
              filterDivisor.dataSources,
              controller2.signal,
              false
            ),
            area
          )
            .then((result) => {
              divisorCount = result;
            })
            .catch((error) => {
              throwError(new Error(error?.message || error));
            })
        );
      } else {
        const filterAll = _.cloneDeep(filter.dataSources);
        filterAll.forEach((ds) => {
          ds.filters.forEach((f) => delete f.value);
        });
        promises.push(
          trackPromise(
            service.queryCount(
              filter.dataSources[0].name,
              filterAll,
              controller2.signal,
              false
            ),
            area
          )
            .then((result) => {
              divisorCount = result;
            })
            .catch((error) => {
              throwError(new Error(error?.message || error));
            })
        );
      }
    }

    Promise.all(promises).then(() => {
      if (data.data.isPercentage) {
        if (divisorCount === 0) {
          setCount(0);
        } else {
          // console.log("count, divisor", count, divisorCount);
          setCount(Number(((count / divisorCount) * 100).toFixed(2)));
        }
      } else {
        setCount(count);
      }
    });
    // if (caseId) {
    //   trackPromise(
    //     service.getLinkedCount(
    //       CounterLinkType.case,
    //       caseId,
    //       data.data.filterId,
    //       data.data.isPercentage,
    //       data.data?.localFilters,
    //       data.data?.divisorFilterId,
    //       ),
    //     area
    //   )
    //     .then((response) => {
    //       if (isMounted()) setCount(response);
    //     })
    //     .catch((error) => {
    //       throwError(new Error(error?.message || error));
    //     });
    // } else {
    //   trackPromise(service.getCount(data.data.filterId, data.data.isPercentage, data.data?.localFilters, data.data?.divisorFilterId), area)
    //     .then((response) => {
    //       if (isMounted()) setCount(response);
    //     })
    //     .catch((error) => {
    //       throwError(new Error(error?.message || error));
    //     });
    // }
  }, [filter, filterDivisor, timePeriod]);

  const getBackgroundColour = () => {
    const colors = ["red", "#FFBF00", "green"];
    if (count !== undefined && data?.data?.colorRange) {
      let colorIndex = 0;
      if (count > data?.data?.colorRange[0] && count < data?.data?.colorRange[1]) {
        colorIndex = 1;
      } else if (count > data?.data?.colorRange[1]) {
        colorIndex = 2;
      }
      if (data?.data.greenToRed) {
        colorIndex = colors.length - 1 - colorIndex;
      }
      return colors[colorIndex];
    }
    return undefined;
  };

  if (count === undefined) return <LoadingSpinner area={area} fixed={false} />;
  return (
      <Box className={classes.display} style={{ backgroundColor: getBackgroundColour() }}>
        {/* <TimePeriodDropdown
        setValue={setTimePeriod}
        value={timePeriod}
        className={classes.timePeriod}
      /> */}
        <div>
          <Typography variant="h5">{data.data.name}</Typography>
        </div>
        <Typography variant="h3">
          <span
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
            className={classes.hover}
          >
            {count}
            {data?.data?.isPercentage ? "%" : undefined}
          </span>
        </Typography>
        <FilterPopover
          anchorEl={anchorEl}
          open={anchorEl !== null}
          filter={filter}
          filterDivisor={data.data?.isPercentage ? filterDivisor : undefined}
        />
      </Box>
  );
};

export default Counter;
