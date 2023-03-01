import React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { TableModel } from "../Model/iTechRestApi/TableModel";
import makeStyles from "@mui/styles/makeStyles";

interface ITableProps {
  model: TableModel;
  minWidth?: number;
}

const useStyles = makeStyles((theme) => ({
  header: {
    backgroundColor: theme.palette.primary.main,
  },
  boldCell: {
    fontWeight: "bold",
  },
  chartContainer: {
    // height: "100%",
    height: "calc(100% - 48px)",
    width: "100%",
    paddingTop: 18,
    backgroundColor: theme.palette.background.paper,
  },
}));

const BasicTable: React.FC<ITableProps> = ({ model, minWidth = 600 }) => {
  const classes = useStyles();
  if (!model) return null;
  // determine if column[1] is also text
  const rightAlignIndex =
    model.data.length > 0 && model.data[0].length > 1
      ? /^\d+$/.test(model.data[0][1])
        ? 0
        : 1
      : 0;

  return (
    <TableContainer component={Paper} style={{ width: "97%" }}>
      <Table sx={{ minWidth: minWidth }} size="small" aria-label="simple table">
        <TableHead className={classes.header}>
          <TableRow>
            {model.header.map((h, i) => (
              <TableCell
                key={i}
                align={i > rightAlignIndex ? "right" : undefined}
                className={classes.boldCell}
              >
                {h}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {model.data.map((row, i) => (
            <TableRow key={i} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              {row.map((v, ci) => (
                <TableCell
                  key={"c" + ci}
                  align={ci > rightAlignIndex ? "right" : undefined}
                  className={
                    i === model.data.length - 1 || ci === row.length - 1
                      ? classes.boldCell
                      : undefined
                  }
                >
                  {v}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BasicTable;
