import React, { ReactElement, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import CircularProgress from "@mui/material/CircularProgress";
import {
  Person,
  PermIdentity,
  PersonPin,
  People,
  FormatSize,
  LineStyle,
  Translate,
  Language,
} from "@mui/icons-material";
import { Typography } from "@mui/material";
import { userService } from "../_services/userService";
import { userIdentifierService } from "../_services/userIdentifierService";
import { securityObjectService } from "../_services/securityObjectService";
import { userGroupService } from "../_services/userGroupService";
import { termService } from "../_services/termService";
import { ruleService } from "../_services/ruleService";
import { ITechDataSecurityObject } from "../Model/iTechRestApi/ITechDataSecurityObject";
import { lexiconService } from "../_services/lexiconService";
import { lexiconGroupService } from "../_services/lexiconGroupService";

export enum SearchDataType {
  Term = 0,
  Rule = 1,
  User = 14, // matches iTechControlColumnType
  SecurityObject = 13, // matches iTechControlColumnType
  Identifier = 15, // matches iTechControlColumnType
  UserGroup = 17, // matches iTechControlColumnType
  Lexicon = 6,
  LexiconGroup = 7,
}

interface IUserSearchProps {
  datatype: SearchDataType;
  value: any;
  setValue: (v: any) => void;
  isLogin?: boolean;
  style?: React.CSSProperties;
}

const filter = createFilterOptions<never>();

export default function UserSearch({
  datatype,
  value,
  setValue,
  isLogin,
  style,
}: IUserSearchProps): ReactElement {
  const [open, setOpen] = useState(false);
  const [currentLogin, setCurrentLogin] = useState<undefined | ITechDataSecurityObject>();
  const [options, setOptions] = useState([]);
  const [searching, setSearching] = useState(false);
  const _ids = (ids: any) => {
    const arr = ids?.map((id: any) => id.identifier).filter((id: any) => id?.includes(search));
    return arr?.length > 0 ? `[${arr.join(", ")}]` : "";
  };
  const _searchLabel = (option: any) =>
    datatype === SearchDataType.Term
      ? `${option.term}`
      : datatype === SearchDataType.Rule
      ? option.name !== undefined
        ? `${option.name} [${option.filterCount} Filters ${option.users?.length ?? 0} Users] : ${
            option.ruleType
          }`
        : ""
      : datatype === SearchDataType.Lexicon
      ? `${option.phrase}`
      : datatype === SearchDataType.LexiconGroup
      ? `${option.name}`
      : datatype === SearchDataType.UserGroup
      ? `${option.displayName}`
      : datatype === SearchDataType.Identifier
      ? `${option.identifier}` //`${option.identifier} [${option.iTechDataUser.forename} ${option.iTechDataUser.surname}]`
      : `${option.forename} ${option.surname} ${_ids(option.iTechDataUserIdentifiers)}`;
  const [search, setSearch] = useState("");
  const loading = open && searching;
  const iconOptions = [
    {
      type: SearchDataType.Term,
      datatype: "Term",
      icon: <FormatSize color="inherit" fontSize="small" />,
    },
    {
      type: SearchDataType.Rule,
      datatype: "Rule",
      icon: <LineStyle color="inherit" fontSize="small" />,
    },
    {
      type: SearchDataType.User,
      datatype: "User",
      icon: <Person color="inherit" fontSize="small" />,
      iTechDataSecurityObjectTypeRowId: 2,
    },
    {
      type: SearchDataType.SecurityObject,
      datatype: "SecurityObject",
      icon: <PermIdentity color="inherit" fontSize="small" />,
      iTechDataSecurityObjectTypeRowId: 2,
    },
    {
      type: SearchDataType.Identifier,
      datatype: "Identifier",
      icon: <PersonPin color="inherit" fontSize="small" />,
    },
    {
      type: SearchDataType.UserGroup,
      datatype: "UserGroup",
      icon: <People color="inherit" fontSize="small" />,
      iTechDataSecurityObjectTypeRowId: 3,
    },
    {
      type: SearchDataType.Lexicon,
      datatype: "Lexicon",
      icon: <Translate color="inherit" fontSize="small" />,
    },
    {
      type: SearchDataType.LexiconGroup,
      datatype: "LexiconGroup",
      icon: <Language color="inherit" fontSize="small" />,
    },
  ];

  const userIcon = (securityObjectTypeRowId?: any) => {
    if (securityObjectTypeRowId === 3)
      return iconOptions.find((i) => i.iTechDataSecurityObjectTypeRowId === securityObjectTypeRowId)
        ?.icon;

    return iconOptions.find((i) => i.type === datatype)?.icon;
  };

  const service = (datatype: number) => {
    return datatype === SearchDataType.Term
      ? termService
      : datatype === SearchDataType.Rule
      ? ruleService
      : datatype === SearchDataType.UserGroup
      ? userGroupService
      : datatype === SearchDataType.SecurityObject
      ? securityObjectService
      : datatype === SearchDataType.User
      ? userService
      : datatype === SearchDataType.Lexicon
      ? lexiconService
      : datatype === SearchDataType.LexiconGroup
      ? lexiconGroupService
      : userIdentifierService;
  };

  const _currentLogin = () => {
    return {
      ...currentLogin,
      forename: "Current",
      surname: `User [${currentLogin?.forename} ${currentLogin?.surname}]`,
      rowId: -1,
      username: "{current}",
    } as never;
  };

  useEffect(() => {
    if (!search) return;
    setSearching(true);
    let active = true;
    (async () => {
      let data;
      if (isLogin !== undefined) data = await service(datatype).search(search, isLogin);
      else data = await service(datatype).search(search);

      if (active) setOptions(data.results);
      setSearching(false);
    })();
    return () => {
      active = false;
    };
  }, [search, datatype, value]);

  useEffect(() => {
    if (!open) {
      if (currentLogin !== undefined) setOptions([_currentLogin()]);
      else setOptions([]);
    }
  }, [open]);

  useEffect(() => {
    if (isLogin && currentLogin === undefined) {
      securityObjectService.current().then((x) => setCurrentLogin(x));
    }
  }, []);

  return <>
    <Autocomplete
      value={value === "" ? null : value}
      key={datatype}
      style={style ?? { width: 300 }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
        setSearch("");
      }}
      filterOptions={(options, params) => {
        const filtered = filter(
          options.map((x: any) => x as never),
          params
        );

        if (currentLogin !== undefined) {
          const login = _currentLogin();
          const isExisting = options.some(
            (option) =>
              login["forename"] === option.forename && login["surname"] === option.surname
          );
          if (!isExisting) filtered.unshift(login);
        }
        return filtered;
      }}
      isOptionEqualToValue={(option, value) => !!option || option.rowId === value.rowId}
      getOptionLabel={_searchLabel}
      onChange={(event, option) => (option ? setValue(option) : setValue(""))}
      options={options}
      loading={loading}
      renderOption={(props, option) => (
        <li {...props}>
          {userIcon(option.iTechDataSecurityObjectTypeRowId)}
          <Typography
            variant="h6"
            noWrap
            style={{
              color: "dateArchived" in option && option.dateArchived !== null ? "red" : undefined,
            }}
          >
            {_searchLabel(option)}
          </Typography>
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search..."
          onChange={(e) => setSearch(e.target.value)}
          InputLabelProps={{shrink:true}}
          InputProps={{
            ...params.InputProps,
            style: {
              color: value.dateArchived !== null && datatype !== 1 && !search ? "red" : undefined,
              padding: 0,
            },
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  </>;
}
