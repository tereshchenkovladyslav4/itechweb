import React, { ReactElement, useState, useEffect } from "react";
import { useStore } from "../_context/Store";
import { versionService } from "../_services/versionService";
import { SimData } from "../Model/iTechRestApi/SimData";
import { SimVersion } from "../Model/iTechRestApi/SimVersion";
import { SimVersions } from "../Model/iTechRestApi/SimVersions";
import { iTechControlSimToFsiEnum } from "../Model/iTechRestApi/iTechControlSimToFsiEnum";
import { fsiService } from "../_services/fsiService";
import { updateVersionAction } from "../_context/actions/PageDataActions";
import {
  hasPreviewOrProperties,
  onOpen,
  onOpenFullscreen,
  onOpenNewTab,
} from "../_helpers/fileActions";
import { showHiddenAction } from "../_context/actions/HiddenActions";
import { useStyles } from "./Versions.style";
import { useHistory } from "react-router-dom";
import { MenuAction } from "../Menu/MenuFunction";
import IconManager from "../_components/IconManager";
import SelectedRowMenu from "../VirtualTable/SelectedRowMenu";
import Waiting from "../_components/Waiting";
import SelectedGridRowType from "../Model/Types/selectedGridRowType";
import useIsMounted from "../_helpers/hooks/useIsMounted";
import { isFilterGroupColor } from "../_helpers/utilities";

type IVersionsProps = {
  versionService: typeof versionService;
  fsiService: typeof fsiService;
  data?: any;
  area?: string;
};

const Versions: React.FC<IVersionsProps> = ({ versionService, fsiService, data }): ReactElement => {
  const { dispatch, selectors } = useStore();
  const fileData = data?.data;
  const classes = useStyles();
  const isMounted = useIsMounted();
  const history = useHistory();

  const [item, setItem] = useState<SelectedGridRowType | undefined>(
    !fileData ? isFilterGroupColor(selectors.getSelectedGridRow(), data) ? selectors.getSelectedGridRow() : undefined  : undefined
  );
  const [versions, setVersions] = useState<SimVersions | undefined>(undefined);

  useEffect(() => {
    const selectedRow = selectors.getSelectedGridRow();
    if (selectedRow && isFilterGroupColor(selectedRow, data)) {
      setItem(selectedRow);
    } 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectors.getSelectedGridRow()]);

  useEffect(() => {
    if (!item?.rowId) return;
    versionService.get(item.rowId.toString()).then((rsp) => {
      if (isMounted()) {
        setVersions(rsp);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  // TODO: change to IFilePreview
  const _selectRenderer = (simData: SimVersion | SimData) => {
    const actions: MenuAction[] = [
      {
        icon: (
          <IconManager fontSize="small" icon="Input" onClick={() => onOpen(simData, onSelect)} />
        ),
        name: "Open",
        id: 2,
        toolTipPlacement: "left-end",
      },
      {
        icon: (
          <IconManager
            fontSize="small"
            icon="Fullscreen"
            onClick={() =>
              onOpenFullscreen(simData, () => dispatch(showHiddenAction(true)), onSelect)
            }
          />
        ),
        name: "Open Full Screen",
        id: 3,
        toolTipPlacement: "left-end",
      },
      {
        icon: (
          <IconManager
            fontSize="small"
            icon="Tab"
            onClick={() => onOpenNewTab(history, simData?.rowId?.toString())}
          />
        ),
        name: "Open in New Tab",
        id: 4,
        toolTipPlacement: "left-end",
      },
    ];

    return (
      simData && (
        <SelectedRowMenu
          actions={actions}
          gid={simData.rowId.toString()}
          filterGroupColor={item?.filterGroupColor}
          defaultAction={() =>
            hasPreviewOrProperties(item?.filterGroupColor)
              ? onSelect(simData)
              : onOpenFullscreen(simData, () => dispatch(showHiddenAction(true)), onSelect)
          }
          color="primary"
        />
      )
    );
  };

  const onSelect = (simData: SimVersion | SimData) => {
    dispatch(updateVersionAction(simData));
    return Promise.resolve();
  };

  const SimToFsi = () => {
    const itemName = item?.name || "File";
    return (
      <div className={classes.vContainer}>
        <div className={classes.sHeader}>
          {item?.documentGuid ? (
            <a href={fsiService.download(item?.documentGuid.toString(), itemName)}>{itemName}</a>
          ) : (
            itemName
          )}
        </div>
        <div>
          {versions?.simToFsi
            ? versions.simToFsi.map((s) => {
                const sName = s.name;
                return (
                  <div className={classes.vSimToFsi} key={s.iTechSimToFsiRowId}>
                    <div className={classes.vName}>
                      {s.fsiGuid ? (
                        <a href={fsiService.download(s.fsiGuid.toString(), sName)}>{sName}</a>
                      ) : (
                        sName
                      )}
                      <div className={classes.vType}>
                        {iTechControlSimToFsiEnum[s.iTechControlSimToFsiType]}
                      </div>
                    </div>
                    <div className={classes.vDate}>{s.obDateInserted.toDateString()}</div>
                    <div className={classes.vSelect}>{_selectRenderer(s)}</div>
                  </div>
                );
              })
            : null}
        </div>
      </div>
    );
  };

  const Version = () => {
    return (
      <div className={classes.vContainer}>
        <div className={classes.vHeader}>{versions?.version?.length || 0} Versions</div>
        <div>
          {versions?.version
            ? versions.version.map((s) => {
                const sName = `Version ${s.version}`;
                return (
                  <div className={classes.vSimToFsi} key={s.iTechSimVersionRowId}>
                    <div className={classes.vName}>
                      {s.fsiGuid ? (
                        <a href={fsiService.download(s.fsiGuid.toString(), sName)}>{sName}</a>
                      ) : (
                        sName
                      )}
                    </div>
                    <div className={classes.vDate}>{s.obDateCreated.toDateString()}</div>
                    <div className={classes.vSelect}>{_selectRenderer(s)}</div>
                  </div>
                );
              })
            : null}
        </div>
      </div>
    );
  };

  return (
    <div data-testid={"versions-" + item?.rowId} className={classes.component}>
      {item && (
        <>
          <SimToFsi /> <Version />
        </>
      )}
      {!item ? <Waiting /> : null}
    </div>
  );
};

export default Versions;
