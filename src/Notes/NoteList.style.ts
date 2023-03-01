import makeStyles from '@mui/styles/makeStyles';
import { StyleProps } from './NoteList';

export const useStyles = makeStyles((theme) => ({
  component: {
    height: "calc(100% - 48px)", // subtract height of button list
    backgroundColor: theme.palette.background.component,
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
  },
  btn: {
    lineHeight: "0.9",
    marginTop: 10,
    left: 10,
    padding: "4px 10px",
  },
  container:{
    backgroundColor:theme.palette.background.default,
    width:'100%',
    overflowY:'auto',
    height:(props: StyleProps) => `calc(100% - ${props.offset}px)`, // allow for preview tab buttons
    // get a gap at top without the following
    position:'absolute',
  }
}));
