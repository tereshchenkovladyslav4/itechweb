import React from "react";
import { ICellIcon, ICellProps } from "./ICellProps";
import { Tooltip } from "@mui/material";
import { ITechControlCollectionType } from "../../Model/iTechRestApi/ITechControlCollectionType";
import { iTechControlCollectionEnum } from "../../Model/iTechRestApi/iTechControlCollectionEnum";
import { TinyButton } from "../../_components/TinyButton";

const _default = {
  type: iTechControlCollectionEnum.byodApp,
  icon: "SpeakerNotes",
  color: "#CCC",
  tooltip: "Custom",
};
const _collectionTypes = [
  {
    type: iTechControlCollectionEnum.tmWhatsappIM,
    icon: "ChatBubble",
    color: "green",
    tooltip: "WhatsApp IM",
  },
  {
    type: iTechControlCollectionEnum.tmWhatsappVoice,
    icon: "LocalPhone",
    color: "red",
    tooltip: "WhatsApp Voice",
  },
  { type: iTechControlCollectionEnum.eMail, icon: "Email", color: "DarkViolet", tooltip: "Email" },
  {
    type: iTechControlCollectionEnum.bloombergIM,
    icon: "ChatBubble",
    color: "DeepPink",
    tooltip: "Bloomberg IM",
  },
  {
    type: iTechControlCollectionEnum.fixedVoice,
    icon: "Phone",
    color: "DarkSlateBlue",
    tooltip: "Fixed Voice",
  },
  {
    type: iTechControlCollectionEnum.kpnMobile,
    icon: "PhoneAndroid",
    color: "Gold",
    tooltip: "KPN Mobile",
  },
  {
    type: iTechControlCollectionEnum.redboxArchive,
    icon: "FileCopy",
    color: "GreenYellow",
    tooltip: "Redbox Archive",
  },
  {
    type: iTechControlCollectionEnum.reutersIM,
    icon: "ChatBubble",
    color: "Green",
    tooltip: "Reuters IM",
  },
  {
    type: iTechControlCollectionEnum.symphonyIM,
    icon: "ChatBubble",
    color: "Indigo",
    tooltip: "Symphony IM",
  },
  {
    type: iTechControlCollectionEnum.teamsIM,
    icon: "ChatBubble",
    color: "LightBlue",
    tooltip: "Teams IM",
  },
  {
    type: iTechControlCollectionEnum.teamsVideo,
    icon: "OpenInBrowser",
    color: "LightGreen",
    tooltip: "Teams Video",
  },
  {
    type: iTechControlCollectionEnum.teamsVoice,
    icon: "Phone",
    color: "LightSalmon",
    tooltip: "Teams Voice",
  },
  {
    type: iTechControlCollectionEnum.telemessageIM,
    icon: "ChatBubble",
    color: "Maroon",
    tooltip: "Telemessage IM",
  },
  {
    type: iTechControlCollectionEnum.telemessageVoice,
    icon: "Phone",
    color: "MediumSpringGreen",
    tooltip: "Telemessage Voice",
  },
  {
    type: iTechControlCollectionEnum.tmlVoice,
    icon: "PhoneAndroid",
    color: "MediumVioletRed",
    tooltip: "TML Voice",
  },
  { type: iTechControlCollectionEnum.tmlim, icon: "ChatBubble", color: "Olive", tooltip: "TML IM" },
  {
    type: iTechControlCollectionEnum.truphoneSMS,
    icon: "ChatBubble",
    color: "Orchid",
    tooltip: "Tru SMS",
  },
  {
    type: iTechControlCollectionEnum.truphoneVoice,
    icon: "PhoneAndroid",
    color: "OrangeRed",
    tooltip: "Tru Voice",
  },
  {
    type: iTechControlCollectionEnum.turretVoice,
    icon: "Phone",
    color: "RosyBrown",
    tooltip: "Turret Voice",
  },
  {
    type: iTechControlCollectionEnum.webEx,
    icon: "OpenInBrowser",
    color: "RoyalBlue",
    tooltip: "WebEx",
  },
];

const _onClick = (e: any) => e.preventDefault();

const _randomNumber = () => {
  const rand = Math.random();
  return Math.trunc(Math.abs(rand * 100)); // generate number between 0-100 from user name hash
};

const _mapIcon = (type: ITechControlCollectionType) => {
  const icon = _collectionTypes.find((x) => x.type === type.rowId) ?? _default;
  return (
    <Tooltip
      title={
        <span>
          {`${icon.tooltip}`}
          <br />
          30 Days: {_randomNumber()}
        </span>
      }
      placement="bottom"
    >
      <span>
        <TinyButton
          icon={icon.icon}
          style={{ backgroundColor: icon.color, marginRight: 5 }}
          onClick={_onClick}
        />
      </span>
    </Tooltip>
  );
};

export const CellIcon: React.FC<ICellProps & ICellIcon> = (props): JSX.Element | null => {
  const { rowData, referenceColumn, column } = props;
  const value = rowData[column.name];
  if (rowData[referenceColumn] === undefined || column?.name !== referenceColumn)
    return <>{value}</>;

  const types = JSON.parse(value) as ITechControlCollectionType[];
  return <>{types?.map(_mapIcon) ?? ""}</>;
};
