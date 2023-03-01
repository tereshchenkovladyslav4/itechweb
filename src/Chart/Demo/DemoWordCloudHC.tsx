import React, { useState, useEffect } from "react";
import LoadingSpinner from "../../_components/LoadingSpinner";
import { eChartMenuOption, IFilteredChartProps } from "../IFilteredChart";
import ChartMenu from "../ChartMenu";
import WordCloudHigh from "../HighChartWordCloud";
import { chartSeriesClick } from "../IChartProps";
import { WordCount } from "../../Model/iTechRestApi/WordCount";
import useIsMounted from "../../_helpers/hooks/useIsMounted";
import { trackPromise } from "react-promise-tracker";
import { setTimeoutAsync } from "./TimeoutPromise";

const initialState = {
  mouseX: null,
  mouseY: null,
};

const DemoWordCloudHC: React.FC<IFilteredChartProps> = ({
  title,
  area,
  onChartMenuSelected,
  chartIndex,
}: IFilteredChartProps) => {
    const isMounted = useIsMounted();

  const [data, setData] = useState<WordCount[]>([]);

  const [selectedWord, setSelectedWord] = useState<string>("");

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
        name: "searchText",
        value: selectedWord,
        option: option,
        chartIndex: chartIndex,
      };
      onChartMenuSelected(data);
    }
  };

  useEffect(() => {
    trackPromise(
        setTimeoutAsync(() => {
          if (isMounted()) {
        setData([
          { text: "Accepted market practice", value: 30 },
          { text: "Avoid losing", value: 34 },
          { text: "Avoid loss", value: 77 },
          { text: "Backdate", value: 11 },
          { text: "bad feeling", value: 51 },
          { text: "bat phone", value: 50 },
          { text: "Bribe", value: 28 },
          { text: "Cover up", value: 15 },
          { text: "Discuss offline", value: 37 },
          { text: "Distort", value: 29 },
          { text: "Do not volunteer information", value: 18 },
          { text: "dominat!", value: 48 },
          { text: "don’t involve compliance", value: 38 },
          { text: "don’t involve JG", value: 40 },
          { text: "don’t involve jonathan", value: 39 },
          { text: "don’t involve Maggie", value: 41 },
          { text: "don’t involve MK", value: 42 },
          { text: "don’t tell compliance", value: 43 },
          { text: "don’t tell JG", value: 45 },
          { text: "don’t tell jonathan", value: 44 },
          { text: "don’t tell Maggie", value: 46 },
          { text: "don’t tell MK", value: 47 },
          { text: "Dump", value: 25 },
          { text: "Failed investment", value: 14 },
          { text: "Fraud", value: 18 },
          { text: "Friendly payments", value: 15 },
          { text: "Gravy", value: 49 },
          { text: "Gray area", value: 76 },
          { text: "Grey area", value: 15 },
          { text: "Long-term value", value: 35 },
          { text: "Hidden", value: 32 },
          { text: "Hide", value: 31 },
          { text: "Illegal", value: 13 },
          { text: "Insider dealing", value: 19 },
          { text: "Keep to ourselves", value: 16 },
          { text: "Layering", value: 26 },
          { text: "Market abuse", value: 17 },
          { text: "Market manipulation", value: 20 },
          { text: "Marking the close", value: 27 },
          { text: "Money laundering", value: 21 },
          { text: "No inspection", value: 12 },
          { text: "Nobody will find out", value: 9 },
          { text: "Not ethical", value: 9 },
          { text: "not made aware", value: 52 },
          { text: "Painting the tape", value: 22 },
          { text: "Pump", value: 24 },
          { text: "Secure line", value: 36 },
          { text: "Special fees", value: 14 },
          { text: "They owe it to me", value: 8 },
        ]);}},
      1500),
      area
    );
  }, []);

  const handleMenuOptionClickedHC = (event: chartSeriesClick) => {
    setState({ mouseX: event.x, mouseY: event.y });
    setSelectedWord(event.value);
  };

  return (
    <>
      {data && data.length ? (
        <>
          <WordCloudHigh
            data={data}
            dataKey=""
            dataValue={[]}
            title={title}
            area={area}
            seriesName="series"
            chartIndex={chartIndex}
            seriesClicked={handleMenuOptionClickedHC}
          />
          <ChartMenu el={state} close={handleClose} clicked={handleMenuOptionClicked} />
        </>
      ) : (
        <LoadingSpinner area={area} />
      )}
    </>
  );
};
DemoWordCloudHC.displayName = "WordCloudHC";

export default DemoWordCloudHC;
