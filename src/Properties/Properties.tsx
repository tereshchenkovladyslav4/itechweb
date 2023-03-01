import React, { ReactElement, useState, useEffect } from "react";
import { useStyles } from "./Properties.styles";
import { useStore } from "../_context/Store";
import { dataService } from "../_services/dataService";
import { tableService } from "../_services/tableService";
import { SimVersion } from "../Model/iTechRestApi/SimVersion";
import { useDataSources } from "../_context/thunks/dataSources";
import { TableEnum } from "../Model/iTechRestApi/TableEnum";
import SelectedGridRowType from "../Model/Types/selectedGridRowType";
import Waiting from "../_components/Waiting";
import ListDisplay from "./ListDisplay";
import { getInvestigationId } from "../_helpers/helpers";
import { isFilterGroupColor } from "../_helpers/utilities";
import WebSimProperties from "./WebSimProperties";

type PropertiesProps = {
  tableService: typeof tableService;
  data?: any;
  area?: string;
};

const Properties: React.FC<PropertiesProps> = ({ tableService, data }): ReactElement => {
  const { selectors } = useStore();
  const [tables, setTables] = useState(selectors.getDataSources());
  const fileData = data?.data;
  const classes = useStyles();

  // trigger in case not populated
  useDataSources(tableService.getAll);

  const [item, setItem] = useState<SelectedGridRowType | undefined>(
    !fileData
      ? isFilterGroupColor(selectors.getSelectedGridRow(), data)
        ? selectors.getSelectedGridRow()
        : undefined
      : undefined
  );

  const [version, setVersion] = useState<SimVersion | undefined>(undefined);

  useEffect(() => {
    const dataSources = selectors.getDataSources();
    if (dataSources.length) {
      setTables((prev) => [...prev, ...dataSources]);
    }
  }, [selectors.getDataSources()]);

  useEffect(() => {
    if (fileData && fileData.FileId) {
      const datasource = fileData.datasource || TableEnum[TableEnum.iTechWebSim];
      dataService.gid(datasource, fileData.FileId).then((rsp) => {
        if (!rsp.datasource) rsp.datasource = datasource;
        setItem(rsp);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const selectedRow = selectors.getSelectedGridRow();
    if (selectedRow && isFilterGroupColor(selectedRow, data)) {
      setItem(selectedRow);
    } else if (!selectedRow) {
      // no row selected so use the investigation subject if present
      const investigationId = getInvestigationId();
      if (investigationId?.rowId !== undefined) {
        dataService
          .gid(investigationId.datasource, investigationId.rowId.toString())
          .then((rsp) => {
            if (!rsp.datasource) rsp.datasource = investigationId.datasource;
            setItem(rsp);
          });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectors.getSelectedGridRow()]);

  useEffect(() => {
    setVersion(selectors.getSelectedVersion());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectors.getSelectedVersion()]);

  useEffect(() => {
    if (!item?.datasource || tables.some((t) => t.name === item?.datasource)) return;

    // TODO: need to convert from savedresults to actual datasource - but dont have this property on selected row item
    // const ds = item?.datasource === "ITechWebSavedResults" ? tableReferenceURL(item.iTechControlTableReferenceTypeChildRowId) : item?.datasource;

    let isMounted = true;
    tableService.name(item?.datasource).then((t) => isMounted && setTables([...tables, t]));
    return () => {
      isMounted = false;
    };
  }, [item?.datasource, tables, tableService]);

  const dataItem: any = version || item?.currentSelected || item;

  const keys = dataItem && Object.keys(dataItem);
  const columns = tables.find((t) => t.name === item?.datasource)?.iTechControlColumns;

  const displayKeys = keys?.filter(
    (k: any) =>
      columns?.some((c: any) => c.name === k && c.gridIndex) && (dataItem as any)[k] !== null
  );

  const dict: [{ key: string; value: any }] = displayKeys?.map(
    (k: any): { key: string; value: any } => ({
      key: columns?.find((c: any) => c.name === k)?.description || "",
      value: dataItem[k],
    })
  );

  return (
    <div data-testid={"properties-" + item?.rowId} className={classes.component}>
      {dict ? (
        item?.datasource === "iTechWebSim" ? (
          <WebSimProperties dict={dict} />
        ) : (
          <ListDisplay dict={dict} />
        )
      ) : (
        <Waiting />
      )}
    </div>
  );
};

export default Properties;
