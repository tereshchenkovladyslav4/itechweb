import React from "react";
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { Popover, Typography } from "@mui/material";
import { DataSource } from "../Model/iTechRestApi/DataSource";
import { Filter } from "../Model/iTechRestApi/Filter";
import { v4 as uuidv4 } from "uuid";
import { AdvancedFilterModel } from "../Model/iTechRestApi/AdvancedFilterModel";
import { useDataSources } from "../_context/thunks/dataSources";
import { tableService } from "../_services/tableService";
import { ITechControlColumn } from "../Model/iTechRestApi/ITechControlColumn";
import { Immutable } from "../_context/selectors/useSelectors";
import { iTechControlColumnEnum } from "../Model/iTechRestApi/iTechControlColumnEnum";
import cronstrue from "cronstrue";
import { TimePeriodEnum } from "../Model/iTechRestApi/TimePeriodEnum";
import { toSentence } from "../_helpers/utilities";

const useStyles = makeStyles((theme) =>
  createStyles({
    popover: {
      pointerEvents: "none",
    },
    popoverSurface: {
      padding: 10,
      width: "20vw",
      backgroundColor: theme.palette.background.default,
    },
    dataSource: {
      color: theme.palette.primary.main,
      fontWeight: "bold",
    },
  })
);

interface IFilterPopoverProps {
  open: boolean;
  anchorEl: any;
  filter: AdvancedFilterModel | null;
  dataSourceDescription?: string;
  filterDivisor?: AdvancedFilterModel | null;
}

const FilterPopover: React.FC<IFilterPopoverProps> = ({
  open,
  anchorEl,
  filter,
  dataSourceDescription,
  filterDivisor,
}) => {
  const classes = useStyles();
  const tableList = useDataSources(tableService.getAll);

  const formatCronOrDates = (val: string) => {
    const parts = val.split(" ");
    if (parts.length === 5) {
      // assume cron
      return cronstrue.toString(val);
    }
    const dateParts = val.split(",");
    if (dateParts.length === 2) {
      return `between ${dateParts[0]} and ${dateParts[1]}`;
    }
    if (!isNaN(Number(val))) {
      return toSentence(TimePeriodEnum[Number(val)]);
    }
    return val;
  };

  function FilterComponent(props: { dataSource: string; filter: Filter }) {
    const { filter, dataSource } = props;
    const nestedFilters = (filter.filters || []).map((childFilter) => {
      return <FilterComponent key={uuidv4()} dataSource={dataSource} filter={childFilter} />;
    });

    const decodedValue = decodeType(
      tableList.filter((x) => x.name === dataSource)[0]?.iTechControlColumns,
      filter.value,
      filter.name
    );
    // for type securityobject/user value is the user object
    const value =
      filter.iTechControlColumnTypeRowId != null &&
      [
        iTechControlColumnEnum.securityObject,
        iTechControlColumnEnum.user,
        iTechControlColumnEnum.identifier,
        iTechControlColumnEnum.userGroup,
      ].includes(filter.iTechControlColumnTypeRowId)
        ? filter.value.identifier ||
          (filter.value.forename
            ? filter.value.forename + " " + filter.value.surname
            : filter.value.displayName)
        : filter.iTechControlColumnTypeRowId == iTechControlColumnEnum.dateTime
        ? formatCronOrDates(decodedValue.value.toString())
        : decodedValue.value;

    const name = decodedValue?.name || filter.name;
    const operation = !value?.toString().startsWith("between")
      ? filter.operation || decodedValue.operation || "IS"
      : "";
    return (
      <>
        {name && (
          <Typography variant="subtitle1" gutterBottom>
            {name} {operation?.toUpperCase()} {value.toString()}
          </Typography>
        )}
        {nestedFilters}
      </>
    );
  }

  return (
    <Popover
      className={classes.popover}
      classes={{
        paper: classes.popoverSurface,
      }}
      open={open}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
    >
      {filter?.dataSources?.map((datasource: DataSource, i) => {
        return (
          <div key={i}>
            <Typography variant="h6" gutterBottom className={classes.dataSource}>
              {dataSourceDescription ?? datasource.name}
            </Typography>
            {datasource?.filters?.map((filter: Filter, ind) => {
              return (
                <FilterComponent key={ind} dataSource={datasource.name} filter={filter} />
              );
            })}
          </div>
        );
      })}
      {filterDivisor && (<Typography variant="h6" gutterBottom className={classes.dataSource}>As percentage of</Typography>)}
      {filterDivisor && filterDivisor?.dataSources?.map((datasource: DataSource, i) => {
        return (
          <div key={i}>
            <Typography variant="h6" gutterBottom className={classes.dataSource}>
              {dataSourceDescription ?? datasource.name}
            </Typography>
            {datasource?.filters?.map((filter: Filter, ind) => {
              return (
                <FilterComponent key={ind} dataSource={datasource.name} filter={filter} />
              );
            })}
          </div>
        );
      })}
    </Popover>
  );
};
export default FilterPopover;

// for a "type" value - lookup the description and the descriptive name of the type and return operation as "IS"
// for other values get the column description & return original value
function decodeType(columns: readonly Immutable<ITechControlColumn>[], value: any, name: string) {
  if (columns && columns.length) {
    const columnType = columns.filter((x) => x.name === name)[0];
    const typeValues = columnType?.types;
    if (typeValues) {
      const index = Number(value);
      if (!isNaN(index) && index < typeValues.length) {
        // wont assume always in rowId order as may change so do a find rather than array indexer
        return {
          value: typeValues.find((x) => x.rowId === index)?.description,
          name: columnType.description,
          operation: "IS",
        };
      }
    }
    return { value, name: columnType?.description };
  }
  // not found so just return the original value
  return { value };
}
