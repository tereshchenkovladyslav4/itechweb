import React, { ComponentType } from "react";
import ChartMenu from "./ChartMenu";
import { chartSeriesClick, IChartProps } from "./IChartProps";
import { eChartMenuOption, IChartSeries } from "./IFilteredChart";

const initialState = {
  mouseX: null,
  mouseY: null,
};

interface IChartWrapperProps {
  opt: IChartProps;
  Chart: ComponentType<IChartProps>;
  callback?(d: IChartSeries): void;
}

const ChartMenuWrapper: React.FC<IChartWrapperProps> = ({
  Chart,
  opt,
  callback,
}) => {
  const [state, setState] = React.useState<{
    mouseX: null | number;
    mouseY: null | number;
  }>(initialState);

  const [selectedSeries, setSelectedSeries] = React.useState<chartSeriesClick>({
    chartIndex: 0,
    value: "",
    x: -1,
    y: -1,
  });

  const handleClick = (click: chartSeriesClick) => {
    if (state.mouseX === null) {
      setState({
        mouseX: click.x - 2,
        mouseY: click.y - 4,
      });
      // store data from the graph series click
      setSelectedSeries(click);
    } else {
      setState(initialState);
    }
  };

  opt.seriesClicked = handleClick; // TODO  - improve this.. currently stops being able to have wrapper with component passed in

  const handleMenuOptionClicked = (option: eChartMenuOption) => {
    if (callback) {
      const data: IChartSeries = {
        name: opt.seriesName,
        value: selectedSeries.value,
        option: option,
        dateStart: selectedSeries.dateStart,
        dateEnd: selectedSeries.dateEnd,
        chartIndex: opt.chartIndex,
      };
      callback(data);
    }
  };

  const handleClose = () => {
    setState(initialState);
  };

  return (
    <div
      style={{ cursor: "context-menu", width: "100%", height: "100%" }}
      onClick={handleClose}
    >
      <Chart {...opt} />
      <ChartMenu
        el={state}
        close={handleClose}
        clicked={handleMenuOptionClicked}
      />
    </div>
  );
};

export default ChartMenuWrapper;
