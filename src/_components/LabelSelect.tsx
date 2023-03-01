import React from 'react'
import { FormControl, InputLabel, Select, SelectProps } from '@mui/material'

/**
 *  Override for MUI select which does not handle outlined select labels very well
 **/
const LabelSelect: React.FC<SelectProps> = (props: SelectProps) => {
  const { label, ...rest } = props

  return (
    <FormControl variant='outlined' id='label'>
      {/* <InputLabel style={{width:props.labelWidth}}>{label}</InputLabel> */}
      <InputLabel htmlFor='labelSelectLabel'>{label}</InputLabel>
      <Select inputProps={{ id: 'labelSelectLabel' }} {...rest} label={label} />
    </FormControl>
  )
}

export default LabelSelect
