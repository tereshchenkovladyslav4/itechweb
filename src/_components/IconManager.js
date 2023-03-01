import React from 'react';
import CustomIcon from './IconList'

export default function IconManager(props) {
  let iconName = props.icon.replace(/Icon$/, '')
  return <CustomIcon iconName={iconName} {...props} />
}