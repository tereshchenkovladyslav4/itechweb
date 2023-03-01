import React, { ReactElement, useEffect, useState } from "react";
import makeStyles from "@mui/styles/makeStyles";
import IconManager from "../_components/IconManager";
import IconPicker from "./IconPicker";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import BusyButton from "../_components/BusyButton";
import { Add } from "@mui/icons-material";
import { menuService } from "../_services/menuService";
import { trackPromise } from "react-promise-tracker";
import { ITechDataWebFolderExtended } from "../Model/Extended/ITechDataWebFolderExtended";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { iTechDataWebFolderEnum } from "../Model/iTechRestApi/iTechDataWebFolderEnum";
import LabelSelect from "../_components/LabelSelect";

const useStyles = makeStyles((theme) => ({
  error: {
    "&.MuiFormHelperText-root": {
      color: theme.palette.secondary.main,
      marginTop: 0,
    },
  },
}));

type PageMenuProps = {
  currentPage: any;
  onClose: () => void;
  onConfirm: (name: string, icon: string, folderId?: number) => Promise<void>;
  area: string;
  rootFolderTypes: iTechDataWebFolderEnum[];
  service: typeof menuService;
};

const PageMenu: React.FC<PageMenuProps> = ({
  currentPage,
  onClose,
  onConfirm,
  area,
  rootFolderTypes,
  service,
}): ReactElement => {
  const classes = useStyles();
  // currentpage will be present with just folderId when its a new page created from a folder node
  const title = currentPage?.name !== undefined ? "Edit Page" : "Add Page";
  const [name, setName] = useState<string>(currentPage?.name || "");
  const [icon, setIcon] = useState<string>(currentPage?.icon || "Menu");
  const [folder, setFolder] = useState<number>(currentPage?.folderId || -1);
  const [error, setError] = useState();
  const folderArea = "foldersList";
  const [folders, setFolders] = useState<ITechDataWebFolderExtended[]>([]);

  function _onConfirm(e: any) {
    e.preventDefault();
    onConfirm(name, icon, folder === -1 ? undefined : folder)
      .then(onClose)
      .catch((err: any) => setError(err));
  }

  function _handleTextClear() {
    setName("");
    setError(undefined);
  }

  useEffect(() => {
    let isMounted = true;

    trackPromise(service.getFolders(rootFolderTypes), folderArea).then((folders) => {
      if (isMounted) {
        setFolders(folders);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <form autoComplete="off" onSubmit={_onConfirm}>
      <Box p={3}>
        <div>
          <Typography>{title}</Typography>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={error !== undefined}
            helperText={error}
            FormHelperTextProps={{ classes: classes }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={_handleTextClear} size="large">
                    <IconManager icon="Clear" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            style={{ marginTop: 5 }}
          />
          <FormControl style={{ minWidth: "50%", marginLeft: 20 }}>
            <LabelSelect
              label="Folder"
              labelId="folderLabel"
              onChange={(e) => setFolder(e.target.value as number)}
              value={folder === -1 ? "" : folder}
            >
              {folders.map((f) => (
                <MenuItem key={f.rowId} value={f.rowId}>
                  {f.path}
                </MenuItem>
              ))}
            </LabelSelect>
          </FormControl>
        </div>
        <div>
          <Typography>Choose icon</Typography>
          <IconPicker icon={icon} setIcon={setIcon} />
        </div>
      </Box>
      <BusyButton
        style={{ margin: "0 0 24px 24px" }}
        onClick={_onConfirm}
        area={area}
        startIcon={<Add />}
      >
        Submit
      </BusyButton>
    </form>
  );
};

export default PageMenu;
