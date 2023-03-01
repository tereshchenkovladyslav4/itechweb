import React from "react";
import { Snackbar } from "@mui/material";
import { Alert } from '@mui/material';


interface ISuccessMessageProps {
    show: boolean;
    setShow(state: boolean): void;
    message:string;
}

const SuccessMessage: React.FC<ISuccessMessageProps> = ({ show, setShow, message }) => {
   const handleClose = (event?: React.SyntheticEvent<any> | Event, reason?: string) => {
       if (reason === 'clickaway') {
           return;
       }

       setShow(false);
   };
   return (
       <Snackbar open={show} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
           <Alert onClose={handleClose} severity="success">
               {message}
           </Alert>
       </Snackbar>
   )
}

export default SuccessMessage;