import React, { useEffect, useRef, useMemo } from "react";
import Highcharts, {
  AnnotationsLabelsOptions,
  AnnotationsShapesOptions,
  AxisSetExtremesEventObject,
  PointClickEventObject,
  PointOptionsObject,
} from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { IChartProps, IUpdate } from "./IChartProps";
import LoadingSpinner from "../_components/LoadingSpinner";
import { withResizeDetector } from "react-resize-detector";
import HC_exporting from "highcharts/modules/exporting";
import HC_annotations from "highcharts/modules/annotations";
import { GraphEvent, GraphEventType } from "../Model/iTechRestApi/StockData";
import { grey, red, yellow } from "@mui/material/colors";
import pbx from "../images/PBX.png";
import sms from "../images/SMS.png";
import { useTheme } from "@mui/material";
import { chartStyles } from "./StockChartWithList.styles";
import { setChartOptions } from "./ChartOptions";
// import DarkUnica from 'highcharts/themes/dark-unica'
import _ from "lodash";
import { useReferredState } from "../_helpers/hooks/useReferredState";
import image1 from "../images/oms_01.png";
import image2 from "../images/oms_02.png";
import image3 from "../images/oms_03.png";
import image4 from "../images/oms_04.png";
import image5 from "../images/oms_05.png";
import image6 from "../images/oms_06.png";
import image7 from "../images/oms_07.png";
import image8 from "../images/oms_08.png";
import image9 from "../images/oms_09.png";
import image10 from "../images/oms_10.png";
import image11 from "../images/oms_11.png";
import image12 from "../images/oms_12.png";
import image13 from "../images/oms_13.png";
import image14 from "../images/oms_14.png";
import image15 from "../images/oms_15.png";
import image16 from "../images/oms_16.png";
import image17 from "../images/oms_17.png";

HC_exporting(Highcharts);
HC_annotations(Highcharts);

// Highcharts.setOptions({
//   chart: {
//     style: {
//       fontFamily: "Open Sans, Arial, Helvetica, sans-serif",
//     },
//   },
// });

const containerStyle = { style: { width: "100%", height: "100%" } };

type IStockProps = IChartProps & IUpdate;

const imgArray = [
  image1,
  image2,
  image3,
  image4,
  image5,
  image6,
  image7,
  image8,
  image9,
  image10,
  image11,
  image12,
  image13,
  image14,
  image15,
  image16,
  image17,
]; // demo - some sample images...

const StockChartActual: React.FC<IStockProps> = ({
  data,
  dataKey,
  title,
  area,
  width,
  height,
  updateData,
  range,
}: IStockProps) => {
  const chartComponent = useRef<any>(null);
  const theme = useTheme();
  // const [dateRange, setDateRange] = useState(range);
  const [dateRange, dateRangeRef, setDateRange] = useReferredState(range);
  const ohlc = data && data.length ? data[0].ohlc : [];
  const volume = data && data.length ? data[0].volume : [];
  const events = data && data.length ? data[0].events : [];
  const omsData = data && data.length ? data[0].oms : [];

  let communications: AnnotationsShapesOptions[] = [];
  let annots: AnnotationsLabelsOptions[] = [];
  const useFlags = data && data[0]?.oms !== undefined;
  const colorMap = [red[500], yellow[500], grey[800]];
  const borderMap = [red[600], yellow[600], grey[900]];
  const offset = [0, 10, 5];

  const imgStyle = chartStyles();

  useEffect(() => {
    if (updateData) {
      updateData(dateRange);
    }
  }, [dateRange?.max, dateRange?.min]);

  useEffect(() => {
    if (range) {
      setDateRange(range);
    }
  }, [range?.min, range?.max]);

  // want ths max Y for the current zoom window.. which means recalc on zoom / event
  //   const baseY = Math.max(...ohlc.map((x:any[]) => x[2]));
  //   const baseY = chartComponent.current?.chart.yAxis[0].max;
  // const baseY_calc = chartComponent.current?.chart.yAxis[0].getExtremes();
  // console.log("base y calc: ", baseY_calc);

  // const base_Y = Math.min(...ohlc.map((x:any[]) => x[2]));
  const baseY = 59;

  if (events.length && !useFlags) {
    annots = events
      .filter((x: GraphEvent) => x.type !== GraphEventType.communication)
      .map((x: GraphEvent) => ({
        format:
          `<span><strong>${x.title}</strong></span><br/>` +
          '<span style="font-size: 10px">{point.x:%a, %b %e, %H:%M:%S}</span><br/>' +
          (x.description ? `<span style="font-size: 10px">${x.description}</span>` : ""),
        backgroundColor: colorMap[x.type],
        borderColor: borderMap[x.type],
        shadow: true,
        point: {
          x: x.dateTicks !== null ? x.dateTicks : Date.parse(x.date as any),
          y: baseY - offset[x.type],
          xAxis: 0,
          yAxis: 0,
        },
      }));

    communications = events
      .filter((x: GraphEvent) => x.type === GraphEventType.communication)
      .map((x: GraphEvent) => ({
        src: x.subType === 1 ? pbx : sms,
        type: "image",
        width: 30,
        height: 30,
        point: {
          x: x.dateTicks !== null ? x.dateTicks : Date.parse(x.date as any),
          y: 40 - (x.subType - 1) * 2,
          xAxis: 0,
          yAxis: 0,
        },
      }));
  }

  const newsDisplayLength = 200;
  const flagsData = events.map((e: GraphEvent) => ({
    x: e.dateTicks,
    title: " &#x1f4f0;", // newspaper emoji
    text:
      e.description?.substring(0, newsDisplayLength) +
      (e.description?.length > newsDisplayLength ? "..." : ""), //+ (e.url?.length ? `<br/> <a href="${e.url}">Link</a>` : ''), cant mouseover the tooltip....
  }));

  let comms: Array<PointOptionsObject> = [];
  if (data && data.length && data[0].comms?.length) {
    comms = data[0].comms.map((x: GraphEvent) => ({
      x: x.dateTicks,
      title: x.title,
      text: x.description,
    }));
  }

  let omsSeries: Array<PointOptionsObject> = [];
  if (omsData?.length) {
    omsSeries = omsData.map((x: GraphEvent, i:number) => ({
      x: x.dateTicks,
      y: x.y,
      title: x.title,
      id:i,
      // title: " &#x1f4f0;", // newspaper emoji
      text: x.description,
      img: x.url,
      color: x?.title?.startsWith("Buy") ? "#ff6600" : "#009900",
      format:
        `<span><strong>${x.title}</strong></span><br/>` +
        (x.description ? `<span style="font-size: 10px">${x.description}</span>` : ""),
    }));
  }
  // if(data && data.length && data[0].oms?.length){
  //   omsData = data[0].oms
  //   .map((x: GraphEvent) => ({
  //     src: x.subType === 34 ? pbx : sms,
  //     type: "image",
  //     width: 30,
  //     height: 30,
  //     point: {
  //       x: x.dateTicks !== null ? x.dateTicks : Date.parse(x.date as any),
  //       y: 40 - (x.subType - 1) * 2,
  //       xAxis: 0,
  //       yAxis: 0,
  //     },
  //   }));
  // }

  // const groupingUnits = [
  //   [
  //     "week", // unit name
  //     [1], // allowed multiples
  //   ],
  //   ["month", [1, 2, 3, 4, 6]],
  // ];

  const _setExtremes = (e: AxisSetExtremesEventObject) => {
    console.log(`min: ${e.min} max: ${e.max}`);
    if (e.trigger === "rangeSelectorButton" && e.userMax === undefined) {
      // seem to get two calls when use the range selector buttons - so ignore the 2nd... ( lodash debounce issue ? )
      console.log("ignoring extremes");
    }
    const min = Math.trunc(e.min),
      max = Math.trunc(e.max);
    if (dateRangeRef?.current?.min !== min || dateRangeRef?.current?.max !== max) {
      setDateRange({ min: min, max: max });
    }
  };
  const _decouncedZoomRef = useRef(_.debounce(_setExtremes, 2000)).current;

  const options: Highcharts.Options = useMemo(() => {
    return {
      chart: {
        backgroundColor: theme.palette.background.paper,
        events: {
          load: function () {
            if (range) {
              // eslint-disable-next-line @typescript-eslint/no-this-alias
              const xAxis = this.xAxis[0];
              console.log("chart load");
              xAxis.setExtremes(range.min, range.max);
            }
          },
        },
      },
      legend: {
        enabled: true,
        borderColor: "grey",
        borderWidth: 1,
        // align: 'right',
        // layout: 'vertical',
        // verticalAlign: 'top',
        // y: 100,
        align: "center",
        verticalAlign: "bottom",
        layout: "horizontal",
        shadow: true,
      },
      xAxis: {
        events: {
          setExtremes: _decouncedZoomRef,
        },
      },
      rangeSelector: {
        buttons: [
          {
            type: "hour",
            count: 1,
            text: "1h",
          },
          {
            type: "day",
            count: 1,
            text: "1D",
          },
          {
            type: "week",
            count: 1,
            text: "1W",
          },
          {
            type: "month",
            count: 1,
            text: "1m",
          },
          {
            type: "all",
            count: 1,
            text: "All",
          },
        ],
        // selected: 1, // day
        buttonTheme: { color: theme.palette.text.primary, fill: theme.palette.primary.main },
      },

      title: {
        text: title,
      },
      navigation: {
        buttonOptions: {
          theme: {
            fill: theme.palette.background.paper,
          },
        },
      },
      yAxis: [
        {
          labels: {
            align: "right",
            x: -3,
          },
          title: {
            text: "OHLC",
          },
          height: "60%",
          lineWidth: 2,
          resize: {
            enabled: true,
          },
        },
        {
          labels: {
            align: "right",
            x: -3,
          },
          title: {
            text: "Volume",
          },
          top: "65%",
          height: "35%",
          offset: 0,
          lineWidth: 2,
        },
      ],

      tooltip: {
        split: true,
      },

      series: [
        {
          type: "candlestick",
          name: dataKey,
          id: "dataseries",
          data: ohlc,
          // dataGrouping: {
          //   units: groupingUnits,
          // },
        },
        {
          type: "column",
          name: "Volume",
          data: volume,
          yAxis: 1,
          // dataGrouping: {
          //   units: groupingUnits,
          // },
        },
        {
          type: "flags",
          data: flagsData,
          shape: "squarepin", // This can be an image url - https://api.highcharts.com/highstock/plotOptions.flags.shape
          onSeries: "dataseries",
          width: 16,
          name: "News",
          color: theme.palette.primary.main,
          fillColor: theme.palette.background.paper,
        },
        {
          type: "flags",
          name: "Communications",
          data: comms,
          // shape: pbx,
          shape: "squarepin",
          yAxis: 0,
        },
        {
          // type: "flags",
          type: "scatter",
          name: "OMS",
          fillColor: theme.palette.background.paper,
          data: omsSeries,
          marker:{
            radius:5, // default is 4
            // symbol:'triangle'
          },
          // shape: "circlepin",
          tooltip: {
            pointFormat: '{point.format}<br/><span style="font-size: 10px">Price: {point.y}</span>',
          },
          point: {
            events: {
              click: function (e: PointClickEventObject) {
                const popup: any = document.getElementsByClassName(imgStyle.popup)[0],
                  popupContent = document.getElementById("myPopup"),
                  img: HTMLImageElement | undefined = popupContent?.getElementsByTagName("img")[0],
                  // eslint-disable-next-line @typescript-eslint/no-this-alias
                  point: any = this,
                  chart = point.series.chart;

                const imgIndex = Math.floor( e.point.index / (omsData.length /imgArray.length) ); // map point to which image we want
                // console.log(`pt ind: ${e.point.index} pt id: ${(e.point as any).id} image index: ${imgIndex}`);
                if (img) {
                  img.src = imgArray[imgIndex];
                }
                if (popup) {
                  let x = point.plotX + chart.plotLeft; 
                  if(window.innerWidth - x  < 640 && x > 640){
                    // display to the left
                    x -= 630;
                  }
                  popup.style.left = x + "px";
                  popup.style.top = point.plotY + chart.plotTop + "px";
                }

                popupContent?.classList.toggle(imgStyle.show);
              },
            },
          },
        },
      ],
      annotations: [
        {
          draggable: "",
          labels: annots,
        },
        {
          draggable: "",
          shapes: communications,
        },
      ],
    } as Highcharts.Options;
  }, [dataKey, ohlc, data, annots]);

  useEffect(() => {
    setChartOptions(theme);
    if (theme.palette.mode === "dark") {
      // DarkUnica(Highcharts);
    }
  }, []);

  useEffect(() => {
    const chart = chartComponent.current?.chart;
    if (chart) {
      chart.reflow();
    }
  }, [width, height]);

  return (
    <>
      {data ? (
        <HighchartsReact
          highcharts={Highcharts}
          constructorType={"stockChart"}
          ref={chartComponent}
          options={options}
          containerProps={containerStyle}
        />
      ) : (
        <LoadingSpinner area={area} />
      )}
    </>
  );

  // For some reason if have another container around the actual chart- it doesnt respond to resize events
  // so moved html / logic for the popup into StockChartWithList

  // return (
  //   <>
  //     {data ? (
  //       <>
  //         <div className={imgStyle.popup}>
  //           <span className={imgStyle.popuptext} id="myPopup" onClick={onImageClick}>
  //             Data
  //             <img src={image}  width="200" height="200" />
  //           </span>
  //         </div>
  //         <HighchartsReact
  //           highcharts={Highcharts}
  //           constructorType={"stockChart"}
  //           ref={chartComponent}
  //           options={options}
  //           containerProps={containerStyle}
  //         />
  //       </>
  //     ) : (
  //       <LoadingSpinner area={area} />
  //     )}
  //   </>
  // );
};

export default withResizeDetector(StockChartActual);
