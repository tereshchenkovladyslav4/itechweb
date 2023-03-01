import React, { ReactElement, useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import useErrors from "../_helpers/hooks/useErrors";
import BusyButton from "../_components/BusyButton";
import { Add } from "@mui/icons-material";
import { trackPromise } from "react-promise-tracker";
import { iTechDataWebFolderEnum } from "../Model/iTechRestApi/iTechDataWebFolderEnum";
import { menuService } from "../_services/menuService";
import { ITechDataWebFolderExtended } from "../Model/Extended/ITechDataWebFolderExtended";
import { MenuItem } from "@mui/material";
import LabelSelect from "../_components/LabelSelect";

type EditFolderProps = {
  onClose: () => void;
  onConfirm: (folderId: number) => Promise<void>;
  currentPage: any;
  title: string;
  area: string;
};

const EditFolder: React.FC<EditFolderProps> = ({
  onClose,
  onConfirm,
  currentPage,
  title,
  area,
}): ReactElement => {
  const { hasError, setErrors } = useErrors();

  const [folders, setFolders] = useState<ITechDataWebFolderExtended[]>([]);
  const [folder, setFolder] = useState<number>(currentPage?.folderId);

  useEffect(() => {
    let isMounted = true;

    trackPromise(menuService.getFolders([iTechDataWebFolderEnum.case]), area).then((folders) => {
      if (isMounted) {
        setFolders(folders);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  function _onConfirm(e: any) {
    e.preventDefault();
    onConfirm(folder)
      .then(onClose)
      .catch((err: any) => {
        if (typeof err === "string") {
          // only one field in this form - so use its name as key
          setErrors({ folderId: [err] });
        } else {
          setErrors(err);
        }
      });
  }

  return (
    <form autoComplete="off" onSubmit={_onConfirm}>
      <Box p={3}>
        <div>
          <Typography style={{ marginBottom: 20 }}>{title}</Typography>

          <LabelSelect
            labelId="folderLabel"
            label="Folder"
            onChange={(e) => setFolder(e.target.value as number)}
            value={folders?.length ? folder : ""}
            error={hasError("folderId")}
            style={{ minWidth: "50%" }}
          >
            {folders.map((f) => (
              <MenuItem key={f.rowId} value={f.rowId}>
                {f.path}
              </MenuItem>
            ))}
          </LabelSelect>
        </div>
      </Box>
      <BusyButton
        style={{ margin: "0 0 24px 24px" }}
        onClick={_onConfirm}
        startIcon={<Add />}
        area={area}
      >
        Submit
      </BusyButton>
    </form>
  );
};

export default EditFolder;
