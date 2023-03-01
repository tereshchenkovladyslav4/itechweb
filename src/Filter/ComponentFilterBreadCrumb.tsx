import React, { useState } from "react";
import { AdvancedFilterModel } from "../Model/iTechRestApi/AdvancedFilterModel";
import { iTechDataWebFilterEnum } from "../Model/iTechRestApi/iTechDataWebFilterEnum";
import { Typography } from "@mui/material";
import { FilterGroup } from "../Model/Types/FilterGroup";
import { useStore } from "../_context/Store";
import { useStyles } from "./ComponentFilterBreadCrumb.styles";
import FilterPopover from "../_components/FilterPopover";
import Chip from "@mui/material/Chip";
import FilterIcon from "@mui/icons-material/Filter";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import TagFacesIcon from "@mui/icons-material/TagFaces";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import _ from "lodash";
import { Clear } from "@mui/icons-material";

interface IComponentFilterBreadCrumbProps {
  filterModels?: Map<iTechDataWebFilterEnum, AdvancedFilterModel>;
  setFilterModels: React.Dispatch<
    React.SetStateAction<Map<iTechDataWebFilterEnum, AdvancedFilterModel> | undefined>
  >;
  dataSourceDescription?: string;
  filterGroup?: FilterGroup;
}

const ComponentFilterBreadCrumb: React.FC<IComponentFilterBreadCrumbProps> = ({
  filterModels,
  setFilterModels,
  dataSourceDescription,
  filterGroup,
}) => {
  const classes = useStyles();
  const { selectors } = useStore();

  const [anchorEl, setAnchorEl] = useState(null);
  const [openedPopoverId, setOpenedPopoverId] = useState(null);

  const allFilters = filterModels;

  const IsfixedTab = () => {
    const tab = selectors.getSelectedTab();
    if (!tab) return undefined;
    return tab.fixed == null ? false : tab.fixed;
  };

  const fixedTab = IsfixedTab();

  function handlePopoverOpen(event: any, popoverId: any) {
    setOpenedPopoverId(popoverId);
    setAnchorEl(event.target);
  }

  function handlePopoverClose() {
    setOpenedPopoverId(null);
    setAnchorEl(null);
  }

  const _removeFilter = (filterType: iTechDataWebFilterEnum) => {
    if (filterModels) {
      filterModels.delete(filterType);
      if (!filterModels.size) {
        setFilterModels(undefined);
      } else {
        // spread doesnt work properly on a map
        // setAppliedModels({...appliedModels});
        setFilterModels(_.cloneDeep(filterModels));
      }
    }
  };

  const handleDelete = (filterType: iTechDataWebFilterEnum) => () => {
    _removeFilter(filterType);

    setOpenedPopoverId(null);
    setAnchorEl(null);
  };

  return (
    <>
      {allFilters && allFilters.size > 0 ? (
        <ul className={classes.root}>
          {Array.from(allFilters.keys()).map((k, index) => {
            let icon;
            const filter = allFilters?.get(k);
            if (!filter) return null;

            switch (k) {
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
                  deleteIcon={<Clear />}
                  //onDelete={fixedTab ? undefined : handleDelete(k)} // TODO: filter components can be added to investigation!
                  onDelete={handleDelete(k)}
                  className={classes.chip}
                  onMouseEnter={(e) => handlePopoverOpen(e, index)}
                  onMouseLeave={handlePopoverClose}
                  style={{
                    backgroundColor: filterGroup,
                    background: `linear-gradient(190deg, rgba(0,0,0,0) 0%, ${filterGroup} 140%)`,
                  }}
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
        <Typography variant="h6" className={classes.noFilters}>
          No External Filters Applied
        </Typography>
      )}
    </>
  );
};

export default ComponentFilterBreadCrumb;
