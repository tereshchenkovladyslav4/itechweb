import React, { ReactElement } from "react";
import { useStyles } from "./IDVerification.styles";
import {
  Avatar,
  Typography,
  TypographyProps,
} from "@mui/material";
import { ITechWebHr } from "../Model/iTechRestApi/ITechWebHr";
import { cyrb128, toSentence } from "../_helpers/utilities";
import { iTechDataUserHrGenderIdentityEnum } from "../Model/iTechRestApi/iTechDataUserHrGenderIdentityEnum";
import { Gauge } from "./Gauge";
import { ITechDataUser } from "../Model/iTechRestApi/ITechDataUser";
import { iTechDataUserIdentifierEnum } from "../Model/iTechRestApi/iTechDataUserIdentifierEnum";

type IUserProfileProps = {
  user: ITechDataUser;
  HRs: ITechWebHr[];
};

interface InfoProps {
  title: string;
  value: string;
}
const Info: React.FC<InfoProps & TypographyProps> = (props) => {
  const { title, value, ...rest } = props;
  if (!value) return null;

  const classes = useStyles();
  return (
    <>
      <Typography variant="body2" className={classes.highlight}>
        {title}
      </Typography>
      <Typography variant="h6" {...rest}>
        {value}
      </Typography>
    </>
  );
};

const UserProfile: React.FC<IUserProfileProps> = ({ user, HRs }): ReactElement => {
  const classes = useStyles();
  const hr = HRs?.length > 0 ? HRs[0] : new ITechWebHr();
  const name = `${user.forename} ${user.surname}`;
  const gender =
    hr?.iTechDataUserHrGenderIdentityTypeRowId === iTechDataUserHrGenderIdentityEnum.male
      ? "men"
      : "women";
  const retention = user.onLegalHold === true ? "On legal hold" : "7 year retention";
  const _randomNumber = () => {
    const rand = cyrb128(name).sort((a, b) => a - b);
    return Math.trunc(Math.abs((rand[0] / rand[1]) * 100)); // generate number between 0-100 from user name hash
  };
  const randomNumber = _randomNumber();

  return (
    <div className={classes.profileContainer}>
      <div className={classes.column}>
        <Avatar
          alt={name}
          src={`https://randomuser.me/api/portraits/${gender}/${randomNumber}.jpg`}
          className={classes.avatarIcon}
        />
        <Info title="Legal Name" value={name} />
        <Info title="Preferred Name" value={name} />
        <Info title="Username" value={user.username} />
        <Info title="Gender" value={hr?.userHrGenderIdentityType} />
      </div>
      <div className={classes.column} style={{ minWidth: 350 }}>
        <Typography variant="body2" className={classes.highlight}>
          Risk Analysis
        </Typography>
        {hr?.riskRating && <Gauge percentage={hr?.riskRating} />}
        <Info title="Start Date" value={hr?.employmentStartDateString} />
        <Info title="Retention" value={retention} />
        <Info title="Role" value={hr?.roleName} />
      </div>
      {user.iTechDataUserIdentifiers?.length > 0 && (
        <div className={classes.column}>
          {user.iTechDataUserIdentifiers.map((x) => {
            return (
              x.iTechDataUserIdentifierTypeRowId && (
                <Info
                  title={`Identifier: ${toSentence(
                    iTechDataUserIdentifierEnum[x.iTechDataUserIdentifierTypeRowId]
                  )}`}
                  value={x.identifier}
                  key={x.rowId}
                />
              )
            );
          })}
        </div>
      )}
      {hr && (
        <div className={classes.column}>
          <Info title="Location" value={hr.roleLocation} />
          <Info title="Location" value={hr.roleLocations} />
        </div>
      )}
    </div>
  );
};
export default UserProfile;
