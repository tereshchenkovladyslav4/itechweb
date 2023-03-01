import React, { useState, useEffect } from 'react';
import { trackPromise } from "react-promise-tracker";
import LoadingSpinner from '../_components/LoadingSpinner';
import { eChartMenuOption, IFilteredChartProps } from './IFilteredChart';
import ChartMenu from './ChartMenu';
import WordCloudHigh from "./HighChartWordCloud";
import { chartSeriesClick } from './IChartProps';
import { WordCount } from '../Model/iTechRestApi/WordCount';
import useIsMounted from '../_helpers/hooks/useIsMounted';
import useAsyncError from "../_helpers/hooks/useAsyncError";

const initialState = {
    mouseX: null,
    mouseY: null,
};

const WordCloudHC: React.FC<IFilteredChartProps> = ({ service, title, area, onChartMenuSelected, chartIndex }: IFilteredChartProps) => {
    const isMounted = useIsMounted();
    const throwError = useAsyncError();
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
            const data = { name: 'searchText', value: selectedWord, option: option, chartIndex: chartIndex };
            onChartMenuSelected(data);
        }
    }

    useEffect(() => {
        trackPromise<WordCount[]>(service(), area)
            .then((result) => {
                if (!isMounted()) return;
                setData(result);
            })
            .catch(error => {
                throwError(new Error(error?.message || error));
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const handleMenuOptionClickedHC = (event: chartSeriesClick) => {
        setState({ mouseX: event.x, mouseY: event.y });
        setSelectedWord(event.value);
    }

    return (
        <>
            {data && data.length ? (
                <>
                    <WordCloudHigh data={data} dataKey='' dataValue={[]} title={title} area={area} seriesName="series" chartIndex={chartIndex} seriesClicked={handleMenuOptionClickedHC} />
                    <ChartMenu el={state} close={handleClose} clicked={handleMenuOptionClicked} />
                </>
            ) :
                <LoadingSpinner area={area} />
            }
        </>
    );
}
WordCloudHC.displayName = "WordCloudHC";

export default WordCloudHC;
