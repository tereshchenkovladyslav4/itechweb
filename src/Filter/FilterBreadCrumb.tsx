import React, { useState, useEffect } from "react";
import { useStore } from "../_context/Store";
import {
  removeFiltersAction,
  removeGraphFiltersAction,
  removeTreeFiltersAction,
} from "../_context/actions/PageDataActions";
import { Theme } from "@mui/material/styles";
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Chip from "@mui/material/Chip";
import FilterIcon from "@mui/icons-material/Filter";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import TagFacesIcon from "@mui/icons-material/TagFaces";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import { AdvancedFilterModel } from "../Model/iTechRestApi/AdvancedFilterModel";
import FilterPopover from "../_components/FilterPopover";
import { iTechDataWebFilterEnum } from "../Model/iTechRestApi/iTechDataWebFilterEnum";
import { Typography } from "@mui/material";
import { TableEnum } from "../Model/iTechRestApi/TableEnum";
import { FilterGroup } from "../Model/Types/FilterGroup";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
      listStyle: "none",
      padding: theme.spacing(0.5),
      margin: 0,
    },
    chip: {
      margin: theme.spacing(0.5),
    },
  })
);

interface IFilterBreadCrumbProps {
  dataSource: string;
  dataSourceDescription?: string;
  filterGroup?:FilterGroup;
}

const FilterBreadCrumb: React.FC<IFilterBreadCrumbProps> = ({
  dataSource,
  dataSourceDescription,
  filterGroup,
}) => {
  const classes = useStyles();
  const { selectors, dispatch } = useStore();

  const [anchorEl, setAnchorEl] = useState(null);
  const [openedPopoverId, setOpenedPopoverId] = useState(null);

  const getFilters = () =>
    selectors
      .getAllFilters(filterGroup)
      ?.map((x) => ({
        ...x,
        dataSources: x.dataSources.filter((f) => f.name === dataSource && f.filters.length),
      }))
      .filter((d) => d.id !== "reviewPageFixedFilter" && d.dataSources.length);

  let allFilters = getFilters();

  useEffect(() => {
    allFilters = getFilters();
  }, [allFilters]);

  function handlePopoverOpen(event: any, popoverId: any) {
    setOpenedPopoverId(popoverId);
    setAnchorEl(event.target);
  }

  function handlePopoverClose() {
    setOpenedPopoverId(null);
    setAnchorEl(null);
  }
  const getFilterTypeId = (filter: AdvancedFilterModel): number | undefined => {
    const appliedFilters = selectors.getAppliedFilters(filterGroup);
    // TBD - compare on rowId or id ?? or both...
    if (appliedFilters?.name === filter.name && appliedFilters?.rowId === filter.rowId) {
      return iTechDataWebFilterEnum.advanced;
    } 
    const treeFilters = selectors.getAppliedTreeFilters(filterGroup);
    if (treeFilters?.name === filter.name && treeFilters?.rowId === filter.rowId) {
      return iTechDataWebFilterEnum.tree;
    }
    const graphFilters = selectors.getAppliedGraphFilters();
    if (graphFilters?.name === filter.name && graphFilters?.rowId === filter.rowId) {
      return iTechDataWebFilterEnum.graph;
    }
    return undefined;
  };

  const handleDelete = (filterToDelete: AdvancedFilterModel) => () => {
    //TODO - Could do with the filter type as a prop on advancedfiltermodel - but for now determine the type from state
    const filterType = getFilterTypeId(filterToDelete);

    switch (filterType) {
      case iTechDataWebFilterEnum.advanced:
        dispatch(removeFiltersAction(TableEnum[dataSource as keyof typeof TableEnum], filterGroup));
        break;
      case iTechDataWebFilterEnum.tree:
        dispatch(removeTreeFiltersAction(TableEnum[dataSource as keyof typeof TableEnum], filterGroup));
        break;
      case iTechDataWebFilterEnum.graph:
        dispatch(removeGraphFiltersAction());
        break;
      default:
        throw Error(`Unknown filter of type ${filterToDelete.name}`);
    }

    setOpenedPopoverId(null);
    setAnchorEl(null);
  };

  return (
    <>
      {allFilters && allFilters.length > 0 ? (
        <ul className={classes.root}>
          {allFilters.map((filter, index) => {
            let icon;
            switch (getFilterTypeId(filter)) {
              case iTechDataWebFilterEnum.advanced:
                icon = <FilterIcon />;
                break;
              case iTechDataWebFilterEnum.tree:
                icon = <AccountTreeIcon />;
                break;
              case iTechDataWebFilterEnum.graph:
                icon = <InsertChartIcon />;
                break;
              default:
                icon = <TagFacesIcon />;
            }

            return (
              // use name in key too as unsaved items dont have an id
              <li key={filter.id + filter.name}>
                <Chip
                  icon={icon}
                  label={filter.name}
                  onDelete={handleDelete(filter)}
                  className={classes.chip}
                  onMouseEnter={(e) => handlePopoverOpen(e, index)}
                  onMouseLeave={handlePopoverClose}
                  style={{backgroundColor:filterGroup}}
                />
                <FilterPopover
                  anchorEl={anchorEl}
                  open={openedPopoverId === index}
                  dataSourceDescription={dataSourceDescription}
                  filter={filter}
                />
              </li>
            );
          })}
        </ul>
      ) : (
        <Typography> No External Filters Applied </Typography>
      )}
    </>
  );
};

export default FilterBreadCrumb;
