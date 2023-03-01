import { Grid, TextField } from "@mui/material";
import { Autocomplete } from '@mui/material';
import React, { useState, useEffect, useCallback } from "react";
import { trackPromise } from "react-promise-tracker";
import { StockItem } from "../Model/iTechRestApi/StockItem";
import { IFilterData } from "../_services/graphService";
import StockChartHC from "./HighChartsStockChartActual";
import { ChartNameIndex, IChartSeries } from "./IFilteredChart";
import useIsMounted from "../_helpers/hooks/useIsMounted";
import useAsyncError from "../_helpers/hooks/useAsyncError";
import { StockData, StockDataBoost } from "../Model/iTechRestApi/StockData";
// import { StockCandleStick } from "../Model/iTechRestApi/StockCandleStick";
import { chartStyles } from "./StockChartWithList.styles";

export interface IStockChartProps {
  service(isin: string, filter?: IFilterData): Promise<StockData | StockDataBoost>;
  area: string;
  filterData?: IFilterData;
  title?: string;
  onChartMenuSelected?(data: IChartSeries): void;
  chartIndex: ChartNameIndex;
  listService?(): Promise<StockItem[]>;
  updateData?: (data?: any) => void;
  selected?: any;
  range?: { min: number; max: number };
}

const StockChartWithList: React.FC<IStockChartProps> = ({
  listService,
  service,
  area,
  chartIndex,
  updateData,
  selected,
  range,
}: IStockChartProps) => {
  const isMounted = useIsMounted();
  const [data, setData] = useState<any>();
  const [stocks, setStocks] = useState<any>([]);
  const [selectedStock, setSelectedStock] = useState<any>(selected);
  const throwError = useAsyncError();
  const chartStyle = chartStyles();

  useEffect(() => {
    if (listService) {
      trackPromise(listService(), area)
        .then((result) => {
          if (!isMounted()) return;
          setStocks(result);
        })
        .catch((error) => {
          throwError(new Error(error?.message || error));
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateZoom = useCallback(
    (data: any) => {
      if (updateData) {
        updateData({ selectedStock: selectedStock, ...data });
      }
    },
    [data?.min, data?.max]
  );

  // const updateZoom =  (data:any) =>{
  //   if (updateData) {
  //     updateData({ selectedStock: selectedStock, ...data });
  //   }
  // }

  useEffect(() => {
    // if (updateData) {
    //   // persist selection - even if its being cleared
    //   updateData({ selectedStock: selectedStock });
    // }
    updateZoom(range);

    if (selectedStock?.symbol) {
      trackPromise(service(selectedStock.symbol), area)
        .then((result) => {
          if (!isMounted()) return;

          // want 2 series... ohlc & volume

          // cant use instanceOf as created as anonymous objects
          // if (result instanceof StockData) {
          const isStockData = (result.data[0] as any)?.open !== undefined;
          if (isStockData) {
            const stockData = {
              ohlc: result.data.map((x: any) => {
                return [Date.parse(x.date), x.open, x.high, x.low, x.close];
              }),
              volume: result.data.map((x: any) => {
                return [Date.parse(x.date), x.volume];
              }),
              events: result.events, // TODO - map ?
              comms: result.comms,
              oms: result.oms,
            };
            setData([stockData]);
            // }else if(result instanceof StockDataBoost) {
          } else {
            const res = result as StockDataBoost;
            const stockData = {
              ohlc: res.data,
              volume: res.data.map((x) => (x.length === 6 ? [x[0], x[5]] : [])),
              events: res.events,
              comms: result.comms,
              oms: result.oms,
            };
            setData([stockData]);
          }
        })
        .catch((error) => {
          throwError(new Error(error?.message || error));
        });
    } else {
      setData(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStock?.symbol]);

  const onImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    e.currentTarget.classList.toggle(chartStyle.show);
  };

  return (
    <Grid xs={12} container item className={chartStyle.chartGrid}>
      <Grid xs={12} container item style={{ justifyContent: "center" }}>
        <Autocomplete
          style={{ width: 300, marginTop: 15 }}
          options={stocks}
          getOptionLabel={(opt: any) => opt.name}
          onChange={(e, newVal) => setSelectedStock(newVal)}
          value={stocks ? selectedStock || "" : ""}
          isOptionEqualToValue={(opt, val) => opt.symbol === val.symbol}
          renderInput={(params) => (
            <TextField
              label="Select Stock"
              autoFocus
              placeholder="Choose stock to display"
              {...params}
            />
          )}
        />
      </Grid>
      <Grid xs={12} container item style={{ height: "calc(100% - 70px)", width: "100%" }}>
        <div className={chartStyle.popup}>
          <span className={chartStyle.popuptext} id="myPopup" onClick={onImageClick}>
            <span>GME level II</span>
            <span style={{ float: "right", marginRight: 10, marginBottom: 4 }}>x</span>
            <img width="600" height="350" />
          </span>
        </div>

        <StockChartHC
          data={data}
          dataKey={selectedStock?.name}
          dataValue={[]}
          area={area}
          chartIndex={chartIndex}
          seriesName=""
          title=""
          updateData={updateZoom}
          range={range}
        />
      </Grid>
    </Grid>
  );
};

StockChartWithList.displayName = "StockChartWithList";

export default StockChartWithList;
