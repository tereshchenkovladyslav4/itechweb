import React, { useState, useEffect, useMemo } from 'react';
import ReactWordcloud, { OptionsProp, Word } from 'react-wordcloud';
import { trackPromise } from "react-promise-tracker";
import LoadingSpinner from '../_components/LoadingSpinner';
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";
import { Grid, Typography } from "@mui/material";
import { eChartMenuOption, IFilteredChartProps } from './IFilteredChart';
import ChartMenu from './ChartMenu';
import { WordCount } from '../Model/iTechRestApi/WordCount';
import useIsMounted from "../_helpers/hooks/useIsMounted";
import useAsyncError from "../_helpers/hooks/useAsyncError";

const initialState = {
    mouseX: null,
    mouseY: null,
};

const WordCloud: React.FC<IFilteredChartProps> = ({ service, title, area, onChartMenuSelected, chartIndex }: IFilteredChartProps) => {
    const isMounted = useIsMounted();
    const throwError = useAsyncError();
    
    const [data, setData] = useState<WordCount[]>([]);

    const [selectedWord, setSelectedWord] = useState<string>("");

    const [state, setState] = React.useState<{
        mouseX?: null | number;
        mouseY?: null | number;
    }>(initialState);

    const options: OptionsProp = useMemo(() => {
        return {
            enableTooltip: true,
            deterministic: false,
            fontFamily: "Open Sans, Arial, Helvetica, sans-serif",
            fontSizes: [12, 60],
            padding: 3
        }
    }, []);

    const handleClose = () => {
        setState(initialState);
    };

    const handleMenuOptionClicked = (option: eChartMenuOption) => {
        if (onChartMenuSelected) {
            const data = { name: 'searchText', value: selectedWord, option: option,  chartIndex: chartIndex };
            onChartMenuSelected(data);
        }
    }

    const onWordClick = (word:Word, event?:MouseEvent):void =>{
        setState({mouseX: event?.clientX, mouseY:event?.clientY});
        setSelectedWord(word.text);
    }

    useEffect(() => {
        trackPromise<WordCount[]>(service(), area)
            .then((result) => {
                if(!isMounted()) return;
                setData(result);
            })
            .catch(error => {
                throwError(new Error(error?.message || error));
          });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const cb = useMemo(() => {
        return {onWordClick:onWordClick};
    }, []);

    return (
        <>
            {data && data.length ? (
                <>
                    <Grid xs={12} container item style={{ justifyContent: "center" }}>
                        <Typography color="textSecondary" variant="h5">{title}</Typography>
                    </Grid>
                    <Grid xs={12} container item style={{ height: "90%" }}>

                        <ReactWordcloud words={data} options={options} callbacks={cb} />
                        <ChartMenu el={state} close={handleClose} clicked={handleMenuOptionClicked} />

                    </Grid>
                </>
            ) :
                <LoadingSpinner area={area} />
            }
        </>
    );
}

WordCloud.displayName = "WordCloud";

export default WordCloud;