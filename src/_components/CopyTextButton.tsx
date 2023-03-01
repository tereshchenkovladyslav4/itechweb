import { Button, ButtonProps } from '@mui/material';
import React from 'react';
import useCopyToClipboard from "../_helpers/hooks/useCopyToClipboard";

interface ICopyTextButtonProps{
  value:any
}

const CopyTextButton: React.FC<ICopyTextButtonProps & Omit<ButtonProps, "onClick">> = ({ value, ...rest }:ICopyTextButtonProps) =>{
  const [copyValueStatus, copyValue] = useCopyToClipboard(value);
  
  return (
      <Button color="primary" variant="contained" onClick={copyValue} {...rest}>
        {copyValueStatus}
      </Button>
  )
};

export default CopyTextButton;