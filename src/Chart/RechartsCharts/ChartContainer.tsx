import React from 'react';
import { ResponsiveContainer } from 'recharts';
import { Grid, Typography } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';


const useStyles = makeStyles(() => ({
    root: {
      '& .recharts-default-legend > li:hover': {
        cursor: "pointer",
        textDecoration: "underline"
      },
    }
  }));
  
interface IChartProps {
    title?: string;
    children: JSX.Element;
  }

const ChartContainer: React.FC<IChartProps> = ({ title, children }: IChartProps) => {
    const style = useStyles();

    return (
        <>
        {title && <Grid xs={12} container item style={{ justifyContent: "center" }}>
          <Typography color="textSecondary" variant="h5">{title}</Typography>
        </Grid>}
        <Grid xs={12} container item style={{ height: "90%" }}>
          <ResponsiveContainer width="100%" height="100%" className={style.root}>
            {children}
          </ResponsiveContainer>
      </Grid>
      </>
    );
}

export default ChartContainer;