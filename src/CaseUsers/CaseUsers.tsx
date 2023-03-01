import { Avatar, Box, Button, Typography } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import React, { useEffect, useState } from "react";
import { trackPromise } from "react-promise-tracker";
import { ITechWebUser } from "../Model/iTechRestApi/ITechWebUser";
import { QuerySet } from "../Model/Types/QuerySet";
import { dataService } from "../_services/dataService";
import { Person } from "@mui/icons-material";

const useStyles = makeStyles((theme) => ({
  user: {
    padding: "10px 5px",
    display: "flex",
    flexDirection: "row",
  },
  text: {
    display: "flex",
    flexDirection: "column",
    marginLeft: 10,
    paddingTop: 2,
    ...theme.typography.body2,
  },
  name: {
    float: "left",
    clear: "both",
  },
  count: {
    float: "left",
    clear: "both",
    fontSize: 12,
    color: theme.palette.primary.main,
  },
  button: {
    float: "right",
    margin: 10,
  },
}));

interface ICaseUsersProps {
  data: any;
  area: string;
}

const CaseUsers: React.FC<ICaseUsersProps> = ({ data, area }) => {
  const classes = useStyles();
  const [users, setUsers] = useState<ITechWebUser[]>([]);
  const [count, setCount] = useState<number>(5);

  useEffect(() => {
    const query = {
      paging: { start: 0, end: count },
      sortBy: "openCases",
      sortDirection: "DESC",
      cols: ["name", "openCases"],
      expressions: [
        {
          rule: "AND",
          filters: [
            {
              iTechControlColumnTypeRowId: 5,
              name: "rowId",
            },
            {
              iTechControlColumnTypeRowId: 6,
              name: "openCases",
              operation: "Greater Than",
              value: "0",
            },
            {
              iTechControlColumnTypeRowId: 6,
              name: "totalCases",
            },
            {
              name: "name",
              iTechControlColumnType: "String",
              iTechControlColumnTypeRowId: 9,
            },
          ],
        },
      ],
      searchOptions: [],
      searchText: "",
    } as QuerySet;
    trackPromise(dataService.query("iTechWebUser", query).then((res) => setUsers(res.results)));
  }, [count]);

  const eventText = (user: ITechWebUser) => {
    let text = `${user.openCases} open events`;
    if (user.openCases !== user.totalCases) text += `, ${user.totalCases} total events`;
    return text;
  };

  return (
    <Box>
      <Button
        variant="contained"
        className={classes.button}
        onClick={() => setCount((prev) => prev + 10)}
      >
        Load More
      </Button>
      {users.length === 0 && <Box className={classes.text}>No case users loaded</Box>}
      {users.map((user) => (
        <Box key={user.rowId} className={classes.user}>
          <Avatar>
            <Person />
          </Avatar>
          <Box className={classes.text}>
            <Typography className={classes.name}>{user.name}</Typography>
            <Typography className={classes.count}>{eventText(user)}</Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default CaseUsers;
