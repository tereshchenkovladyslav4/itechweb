import React, { ReactElement } from "react";
import { useStyles } from "./IDVerification.styles";
import { Chip, Table, TableBody, TableCell, TableRow, Typography } from "@mui/material";
import { ITechDataCase } from "../Model/iTechRestApi/ITechDataCase";
import IconManager from "../_components/IconManager";
import { capitalize } from "lodash";

type ICaseUserProps = {
  selectedCase: ITechDataCase;
};

const CaseUser: React.FC<ICaseUserProps> = ({ selectedCase }): ReactElement => {
  const classes = useStyles();

  //case values
  const dataCase: any = selectedCase;
  const caseKeyFilter = [
    "subjectName",
    "subjectPreviousSurname",
    "subjectEmail",
    "subjectEmailConfirm",
    "subjectPhone",
    "subjectMobile",
    "subjectStreet",
    "subjectCity",
    "subjectPostCode",
    "subjectCountry",
  ];

  const formattedCaseKeys = [
    "Name",
    "Previous Surname(s)",
    "Email",
    "Email Acceptance",
    "Phone",
    "Mobile",
    "Street",
    "City",
    "Post Code",
    "Country",
  ];

  const caseKeys =
    selectedCase &&
    Object.keys(dataCase)
      .filter((key) => caseKeyFilter.includes(key))
      .sort(function (a, b) {
        return caseKeyFilter.indexOf(a) - caseKeyFilter.indexOf(b);
      });

  const caseDictionary = caseKeys?.map((k: any, index) => ({
    key: formattedCaseKeys[index],
    value: dataCase[k]?.toString(),
  }));

  //arg values
  const _argsDictionary = (): { key: string; value: any }[] | undefined => {
    if (!selectedCase?.args) return undefined;
    const json = JSON.parse(selectedCase.args);
    const dict = [];
    if (json["alternativeAddress1"])
      dict.push({ key: "Alternative Address 1", value: json["alternativeAddress1"] });
    if (json["alternativeAddress2"])
      dict.push({ key: "Alternative Address 2", value: json["alternativeAddress2"] });
    if (json["alternativeAddress3"])
      dict.push({ key: "Alternative Address 3", value: json["alternativeAddress3"] });
    if (json["product.other"]) dict.push({ key: "Other products", value: json["product.other"] });

    const products = Object.keys(json)
      .filter((key) => key.includes("product") && json[key] === true)
      .map((key) => capitalize(key.replace("product.", "")))
      .join(", ");
    if (products) dict.push({ key: "Products", value: products });
    const info = Object.keys(json)
      .filter((key) => key.includes("info") && json[key] === true)
      .map((key) => capitalize(key.replace("info.", "")))
      .join(", ");
    if (info) dict.push({ key: "Information", value: info });

    return dict;
  };

  //user values
  const dataUser: any = selectedCase?.iTechDataUser;
  const caseUserFilter = ["forename", "surname", "username"];
  const formattedCaseUserKeys = ["Forename", "Surname", "Username"];
  const userKeys =
    dataUser &&
    Object.keys(dataUser)
      .filter((key) => caseUserFilter.includes(key) && dataUser[key])
      .sort(function (a, b) {
        return caseUserFilter.indexOf(a) - caseUserFilter.indexOf(b);
      });

  const userDictionary = userKeys?.map((k: any, index: number) => ({
    key: formattedCaseUserKeys[index],
    value: dataUser[k],
  }));

  return (
    <>
      <IconManager className={classes.icon} icon="Person" color="primary" />
      <Typography className={classes.header} variant="h5" component="h5">
        {selectedCase?.name}
      </Typography>
      <Table>
        <TableBody>
          {userDictionary &&
            userDictionary.map((row: any) => (
              <TableRow key={row.key} className={classes.tableRow}>
                <TableCell className={classes.tableCell} component="th" scope="row">
                  {row.key}
                </TableCell>
                <TableCell className={classes.tableCell} align="right">
                  {row.value}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <Typography className={classes.header} variant="h6" component="h6">
        Case Details
      </Typography>
      <Table>
        <TableBody>
          {caseDictionary &&
            caseDictionary.map((row) => (
              <TableRow key={row.key} className={classes.tableRow}>
                <TableCell className={classes.tableCell} component="th" scope="row">
                  {row.key}
                </TableCell>
                <TableCell className={classes.tableCell} align="right">
                  {row.value}
                </TableCell>
              </TableRow>
            ))}
          {_argsDictionary()?.map((row) => (
            <TableRow key={row.key} className={classes.tableRow}>
              <TableCell className={classes.tableCell} component="th" scope="row">
                {row.key}
              </TableCell>
              <TableCell className={classes.tableCell} align="right">
                {row.value}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedCase?.iTechDataUser?.iTechDataUserIdentifiers && (
        <>
          <Typography className={classes.header} variant="h6" component="h6">
            Identifiers
          </Typography>
          <div className={classes.chipList}>
            {selectedCase?.iTechDataUser?.iTechDataUserIdentifiers &&
              selectedCase.iTechDataUser.iTechDataUserIdentifiers
                .filter((x) => x !== undefined && x.iTechDataUserRowId)
                .map((id, index) => <Chip key={index} label={id.identifier} variant="outlined" />)}
          </div>
        </>
      )}
    </>
  );
};

export default CaseUser;
