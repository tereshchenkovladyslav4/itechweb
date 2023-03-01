import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles(() => ({
    //.MuiAccordionDetails-root
    accordion: {
        margin: 5,
    },
    accordionSummary: {
        overflowWrap: "anywhere",
        
        // overflow:"hidden",
        // whiteSpace:"nowrap",
        // textOverflow:"ellipsis",
    },
    accordionInner:{
        backgroundColor: '#fafafa',
        margin:"10px 20px",
    },
    root: {
        flexWrap: "wrap",
    }
}));
