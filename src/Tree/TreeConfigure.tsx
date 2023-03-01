import React, { useState, useEffect, ReactElement } from "react";
import makeStyles from '@mui/styles/makeStyles';
import { tableService } from "../_services/tableService";
import { WIZARD_STATE } from "../_components/wizardState";
import { ComponentType } from "../ComponentDisplay/componentType";
import { useDataSources } from "../_context/thunks/dataSources";
import { ITechControlTable } from "../Model/iTechRestApi/ITechControlTable";
import { Immutable } from "../_context/selectors/useSelectors";
import clsx from "clsx";
import KeyTypeDrag from "../KeyType/KeyTypeDrag";
import IconManager from "../_components/IconManager";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import _ from "lodash";
import "./TreeConfigure.css";

const useStyles = makeStyles(() => ({
  settings: {
    float: "right",
  },
  display: {
    margin: "4vh",
  },
  error: {
    color: "Red",
    marginBottom: 10,
  },
}));

type TreeConfigureProps = {
  updateData: (items: any) => void;
  updateComponent: (component: any) => void;
  area: string;
};

const TreeConfigure: React.FC<TreeConfigureProps> = ({
  updateData,
  updateComponent,
  ...props
}): ReactElement => {
  const classes = useStyles();
  const [tableList, setTableList] = useState<Array<any>>([]);
  const tables = useDataSources(tableService.getAll);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (tables.length) {
      _setTables(tables);
    }
  }, [tables]);

  useEffect(() => {
    // clear on selection
    if (tables.length) {
      setError(undefined);
    }
  }, [tableList]);

  const _setTables = (tables: ReadonlyArray<Immutable<ITechControlTable>>) => {
    // ensure that the table has columns and some are tree "usage" columns
    let items = _.cloneDeep(
      _.filter(
        tables,
        (i) => i.iTechControlColumns.length > 0 && i.iTechControlColumns.some((c) => c.treeIndex)
      )
    ) as ITechControlTable[];

    items.forEach((table: any, index) => {
      table.id = `${table.rowId}-parent-Tree`;
      table.subItems = table.iTechControlColumns;
      table.subItems = table.subItems.filter((i: any) => i.treeIndex);
      table.subItems = _.orderBy(table.subItems, ["treeIndex"]);
      table.subItems.map((i: any) => {
        i.id = `${i.rowId}-child-Tree`;
        i.index = index;
        i.checked = i.treeSelected;
        return i;
      });
      table.subItems = _.orderBy(table.subItems, ["index"]);
      table.type = table.abb;
      return table;
    });
    items = _.orderBy(items, ["description"]);
    setTableList(items);
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    let dataSources = _.cloneDeep(tableList);

    // error if no source selected
    dataSources = _.filter(dataSources, (i) => i.checked);
    if (dataSources.length === 0) {
      setError("Please select at least one source");
      return;
    }
    dataSources.map((i, index) => {
      delete i.iTechControlColumns;
      i.index = index;
      i.subItems = _.filter(i.subItems, (s) => s.checked);
      i.subItems.map((s: any) => delete s.types);
      i.subItems.map((s: any, index: any) => (s.index = index));
      return i;
    });
    const data = { componentType: ComponentType.TreeFilter, data: dataSources };
    updateData(data);
  };

  const BackButton = () => {
    return (
      <Button
        style={{ margin: "0 0 24px 0" }}
        onClick={() =>
          updateComponent({
            name: null,
            wizardType: null,
            data: null,
            config: true,
            state: WIZARD_STATE.CHOOSE_COMPONENT,
          })
        }
        {...props}
      >
        <IconManager icon="ArrowBackIos" /> Back
      </Button>
    );
  };

  return (
    <form onSubmit={onSubmit}>
      <Box className={classes.display}>
        <BackButton />
        <Button style={{ margin: "0 0 24px 10px" }} type="submit">
          <IconManager icon="ArrowForwardIos" /> Submit
        </Button>
        {error && <div className={clsx(classes.error)}>{error}</div>}
        <Typography variant="h4">Configure Tree</Typography>
        <Typography variant="h6">
          Drag tree nodes into correct order and select which ones to filter on
        </Typography>
        <KeyTypeDrag items={tableList} setItems={setTableList} />
      </Box>
    </form>
  );
};

export default TreeConfigure;
