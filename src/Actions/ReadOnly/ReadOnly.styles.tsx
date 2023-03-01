import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles(() => ({
  header: {
    fontSize: 8,
    vw: 100,
    textAlign: "center",
  },
  tableBody: {
    maxWidth: 800,
    minWidth: 250,
    display: "contents",
  },
  tableRow: {
    height: 30,
  },
  tableCell: {
    padding: "0px 16px",
  },
}));
