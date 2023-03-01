import React, { useState, useEffect } from "react";
import { trackPromise } from "react-promise-tracker";
import DependencyWheelComponent from "./HighChartDependencyWheel";
import { IFilteredChartProps } from "./IFilteredChart";
import useIsMounted from "../_helpers/hooks/useIsMounted";
import useAsyncError from "../_helpers/hooks/useAsyncError";
import { FormControlLabel, Radio, RadioGroup, Grid } from "@mui/material";
import { useStyles } from "./Chart.styles";

const DependencyChart: React.FC<IFilteredChartProps> = ({
  service,
  area,
  filterData,
  chartIndex,
  title,
}: IFilteredChartProps) => {
  const isMounted = useIsMounted();
  const [data, setData] = useState<any>(); // leave undefined so dont draw a empty chart while retrieve data
  const throwError = useAsyncError();
  const [value, setValue] = useState("1");
  const classes = useStyles();

  useEffect(() => {
    const controller = new AbortController();

    if (filterData) {
      filterData.value = value;
      filterData.signal = controller.signal;
    } else {
      filterData = { value, subItems: [], localFilters: [], signal: controller.signal };
    }
    trackPromise<any[]>(service(filterData), area)
      .then((result) => {
        if (!isMounted()) return;
        setData(result);
      })
      .catch((error) => {
        throwError(new Error(error?.message || error));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return (
    <div className={classes.chartContainer}>
      <Grid
        container
        item
        alignContent="center"
        justifyContent="center"
        style={{ position: "absolute", top: 3 }}
      >
        <RadioGroup row onChange={handleChange} value={value}>
          <FormControlLabel value="1" control={<Radio size="small" />} label="Person" />
          <FormControlLabel value="2" control={<Radio size="small" />} label="Team" />
          <FormControlLabel value="3" control={<Radio size="small" />} label="Role" />
          <FormControlLabel value="4" control={<Radio size="small" />} label="Company" />
        </RadioGroup>
      </Grid>
      <div className={classes.commsChart}>
        <DependencyWheelComponent
          area={area}
          data={data}
          dataValue={[]}
          title={title}
          dataKey={""}
          seriesName={""}
          chartIndex={chartIndex}
        />
      </div>
    </div>
  );
};

DependencyChart.displayName = "DependencyChart";

export default DependencyChart;
