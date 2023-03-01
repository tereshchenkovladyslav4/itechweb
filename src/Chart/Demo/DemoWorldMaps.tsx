import React from "react";
import { eChartMenuOption, IFilteredChartProps } from "../IFilteredChart";
import ChartMenu from "../ChartMenu";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsMap from "highcharts/modules/map";
import mapDataIE from "@highcharts/map-collection/custom/world-continents.topo.json";
import proj4 from "proj4";

highchartsMap(Highcharts); 

if (typeof window !== "undefined") {
    window.proj4 = window.proj4 || proj4;
}

const initialState = {
  mouseX: null,
  mouseY: null,
};

const mapOptions = {
    chart: {
      map: "topology"
    },
    title: {
      text: "Location: UK"
    },
    credits: {
      enabled: false
    },
    mapNavigation: {
      enabled: true
    },
    tooltip: {
      headerFormat: "",
      pointFormat: "lat: {point.lat}, lon: {point.lon}"
    },
    series: [
      {
       
        name: "Basemap",
        mapData: mapDataIE,
        borderColor: "#A0A0A0",
        nullColor: "rgba(200, 200, 200, 0.3)",
        showInLegend: false
      },
      {
        type: "mappoint",
        name: "Locations",
        color: "#4169E1",
        data: [{ z: 10, keyword: "London", lat: 51.514186, lon: -0.088648 }],
        cursor: "pointer",
        width: "2",
        height: "2",
      }
    ]
  };

const DemoWorldMaps: React.FC<IFilteredChartProps> = ({
  title,
  area,
  onChartMenuSelected,
  chartIndex,
}: IFilteredChartProps) => {
    
  const [state, setState] = React.useState<{
    mouseX?: null | number;
    mouseY?: null | number;
  }>(initialState);

  const handleClose = () => {
    setState(initialState);
  };

  const handleMenuOptionClicked = (option: eChartMenuOption) => {
    if (onChartMenuSelected) {
      const data = {
        name: "WorldMap",
        value: "WorldMap",
        option: option,
        chartIndex: chartIndex,
      };
      onChartMenuSelected(data);
    }
  };


  return (
    <>
           <HighchartsReact
            constructorType={"mapChart"}
            highcharts={Highcharts}
            options={mapOptions}
            />
          <ChartMenu el={state} close={handleClose} clicked={handleMenuOptionClicked} />
    </>
  );
};
DemoWorldMaps.displayName = "World Maps";

export default DemoWorldMaps;
