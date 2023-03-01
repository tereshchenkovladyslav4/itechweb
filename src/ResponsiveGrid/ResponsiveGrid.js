import React, { useEffect, useState } from "react";
import { WidthProvider } from "react-grid-layout";
import { parseJSON } from "../_helpers/jsonParser";
import { WIZARD_STATE } from "../_components/wizardState";
import { trackPromise } from "react-promise-tracker";
import { isChart } from "../Chart/IFilteredChart";
import { iTechDataWebTemplateEnum } from "../Model/iTechRestApi/iTechDataWebTemplateEnum";
import { Portal } from "@mui/material";
import { fsiService } from "../_services/fsiService";
import { dataService } from "../_services/dataService";
import { ComponentType } from "../ComponentDisplay/componentType";
import { useStore } from "../_context/Store";
import { showHiddenAction } from "../_context/actions/HiddenActions";
import { Charts } from "../Chart/IFilteredChart";
import { filterGroupColors } from "../Model/Types/FilterGroup";
import { refreshDropdownLists } from "../Model/Types/RefreshInterval";
import { useStyles } from "./ResponseGrid.styles";
import { useTheme } from "@mui/material";

import "./ResponsiveGrid.css";
import _ from "lodash";
import Grid from "react-grid-layout";
import clsx from "clsx";
import IconManager from "../_components/IconManager";
import ComponentDisplay from "../ComponentDisplay/ComponentDisplay";
import Tippy from "@tippyjs/react";
import ColorDropdown from "../_components/ColorDropdown";
import RefreshDropdown from "../_components/RefreshDropdown";
import ComponentErrorBoundary from "../ComponentErrorBoundary";
import HiddenOnState from "../_components/HiddenOnState";
import Preview from "../Preview/Preview";
import FullScreen from "../_components/FullScreen";
import SpeedDialMenu from "../Menu/SpeedDialMenu";
import SaveTemplate from "../Menu/SaveTemplate";
import AddReport from "../Menu/AddReport";
import LoadingSpinner from "../_components/LoadingSpinner";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DataUsageIcon from "@mui/icons-material/DataUsage";

//
const minW = 4,
  maxW = 100,
  minH = 4,
  maxH = 100;
const ResponsiveReactGridLayout = WidthProvider(Grid);

// attempt to scale the grid height for different resolutions
const scaleScreenHeight = () => {
  const defaultH = 20;
  const lostSpace = 143;
  const availH = 937 - lostSpace; // when at 1080p
  const innerH = window.innerHeight - lostSpace;
  // may need experimenting with at higher resolutions...
  let h = Math.round((defaultH / availH) * innerH);
  const r = 937 / window.innerHeight;
  const f = Math.round(10 - r * 10); // extra scaling...
  h += f;
  return h;
};

const rowHeight = scaleScreenHeight(),
  defaultCols = 24,
  defaultHeight = 12,
  defaultWidth = 8;

ResponsiveGrid.defaultProps = {
  className: "layout",
  cols: defaultCols,
  rowHeight: rowHeight,
};

function ResponsiveGrid(props) {
  const { parent, service } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [layout, setLayout] = useState(getParentComponents(parent));
  const [addElement, setAddElement] = useState(false);
  const [columns] = useState(defaultCols);
  const [gridArea] = useState(Math.random().toString(36).substring(2, 5));
  const [flashBackground, setFlashBackground] = useState(undefined); // color value when a filter group color applied
  const { selectors, dispatch } = useStore();

  function _newItem(item) {
    return {
      ...item,
      minW,
      maxW,
      minH,
      maxH,
      i: item.rowId.toString(),
      data: parseJSON(item.json),
      area: Math.random().toString(36).substring(2, 5),
    };
  }

  function getParentComponents(parent) {
    if (!parent?.iTechDataWebComponents || parent.iTechDataWebComponents.length === 0) return [];

    const components = parent.iTechDataWebComponents.map(_newItem);

    return components;
  }

  const hasFilterableDataSource = () => {
    if (layout.length > 0) {
      // check if the tab has a grid or any chart

      return (
        layout.some((l) => !!l.data?.name) ||
        layout.some((l) => Charts.includes(l.data?.componentType, 1))
      );

      // if we want this to be does the tab have any filters applied ( not including result set )
      // i.e graph / advanced / tree filter or grid has local filter / search string

      // this kind of works - if tab redisplayed after local grid filters added
      //  ( otherwise the layout data localfilters is stale and doesnt reflect current applied filters)
      // return (
      //   selectors.getAllFilters() !== undefined ||
      //   layout.some((c) => c.data?.localFilters?.some((f) => f.value?.length > 0)) ||
      //   layout.some((c) => c.data?.searchText?.length > 0)
      // );
    }
    return false;
  };

  //Speed Dial State
  const menuActions = [
    {
      icon: <AddIcon />,
      name: "Add Item",
      handler: _onAdd,
      visible: parent?.fixed !== true,
    },
    {
      icon: <NoteAddIcon />,
      name: "Save Template",
      handler: showAddTemplate,
      operation: iTechDataWebTemplateEnum.template,
      visible: parent?.fixed !== true && layout?.length > 0,
    },
    {
      icon: <VisibilityIcon />,
      name: "Save View",
      handler: showAddTemplate,
      operation: iTechDataWebTemplateEnum.view,
      visible: hasFilterableDataSource, // function
    },
    {
      icon: <DataUsageIcon />,
      name: "Reporting",
      handler: showAddReport,
      operation: iTechDataWebTemplateEnum.view,
      visible: true,
    },
  ];

  const [openTemplate, setOpenTemplate] = useState(false);
  const [templateType, setTemplateType] = useState(iTechDataWebTemplateEnum.template);
  const [openReport, setOpenReport] = useState(false);

  function showAddTemplate() {
    setOpenTemplate(!openTemplate);
  }

  function showAddReport() {
    setOpenReport(!openReport);
  }

  useEffect(() => {
    _loadGrid();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parent?.rowId]);

  useEffect(() => {
    // '' is a valid value...
    if (flashBackground !== undefined) {
      // set a timer
      const timer = setTimeout(() => {
        setFlashBackground(undefined); // clear color
      }, 1000);

      // cleanup
      return () => {
        clearTimeout(timer);
      };
    }
  }, [flashBackground]);

  function _loadGrid() {
    if (!parent || !service) return;
    if (parent.iTechDataWebComponents?.length > 0) {
      // this will only be populated when grid rendered from InvestigationPage.tsx
      setLayout(getParentComponents(parent));
      return;
    }
    if (parent.tabType !== undefined) {
      trackPromise(service.tabType(parent.tabType), gridArea).then((c) =>
        setLayout(c.map(_newItem))
      );
    } else {
      trackPromise(service.tab(parent.rowId), gridArea).then((c) => setLayout(c.map(_newItem)));
    }
  }

  function _onAdd() {
    const component = {
      x: (layout.length * defaultWidth) % (columns || defaultCols),
      y: 0,
      w: defaultWidth,
      h: defaultHeight,
    };

    component.iTechDataWebTabRowId = parent.rowId;

    trackPromise(service.add(component), gridArea).then((c) => {
      let newItem = _newItem(c);
      newItem["$id"] = (layout.length + 1).toString();
      let _layout = [...layout, newItem];
      setLayout(_layout);
    });
  }

  function _onChange(layoutIn, allLayouts, thenChange) {
    if (layoutIn.length === 0) return;

    const oldLayout = [...layout];
    let changed = layoutIn.length !== oldLayout.length;

    const newLayout = oldLayout.map((el, index) => {
      const u = layoutIn.find((l) => l.i === el.i);
      if (!changed && (el.h !== u.h || el.w !== u.w || el.x !== u.x || el.y !== u.y)) {
        changed = true;
      }
      el.h = u.h;
      el.w = u.w;
      el.x = u.x;
      el.y = u.y;
      el.minH = u.minH;
      el["$id"] = index;
      const prevColor = el?.data?.filterGroupColor;
      el.data = parseJSON(el.json);
      if (prevColor) {
        el.data.filterGroupColor = prevColor;
      }
      const val = u.prevH || el.data?.prevH;
      if (el.data && val !== el.data?.prevH) {
        el.data.prevH = u.prevH || el.data.prevH;
        el.data.prevMinH = u.prevMinH || el.data.prevMinH;
        el.json = JSON.stringify(el.data);
      }

      if (!el.area) el.area = Math.random().toString(36).substring(2, 5);
      return el;
    });

    if (!changed) return;

    setLayout(newLayout);

    trackPromise(service.update(newLayout), gridArea).then(() => {
      setAddElement(thenChange !== undefined); // awful hack to force update of response grid after maximise
      // reset part moved to hook below.
    });
  }

  // function refresh(){
  //   location.reload(true);
  // }
  // setInterval(refresh,10000);

  function _onChangeOnRefresh(layoutIn, count, thenChange) {
    if (layoutIn.length === 0) return;

    const oldLayout = [...layout];
    let changed = layoutIn.length !== oldLayout.length;
    const newLayout = oldLayout.map((el) => {
      if (!changed && count < 100) {
        // use setInterval here somehow for each set interval
        changed = true;
      }
      el.json = JSON.stringify(el.data);
      count++;
      return { ...el };
    });

    if (!changed) return;
    setLayout(newLayout);
    trackPromise(service.update(newLayout), gridArea).then(() => {
      setAddElement(thenChange !== undefined); // awful hack to force update of response grid after maximise
      // reset part moved to hook below.
    });
  }

  useEffect(() => {
    if (addElement) {
      // have to reset this in a hook with React 18 (due to batching)
      setAddElement(false);
    }
  }, [addElement]);

  function _createElement(el) {
    //if component is fixed, set to static
    if (parent && parent.fixed) el.static = true;

    // component is minimized
    if (el.h === 1) {
      return (
        <div
          key={el.rowId}
          data-grid={el}
          style={{
            backgroundColor: theme.palette.primary.main,
            fontFamily: theme.typography.fontFamily,
            width: el.w,
            height: 20,
            minHeight: 20,
            padding: "2px 0px 0px 10px",
          }}
        >
          {el.data?.title || el.data?.componentType}
          <Tooltip
            title="Restore"
            style={{ maxHeight: "20px", position: "absolute", right: 10, top: -2 }}
          >
            <span onClick={() => _onRestoreItem(el)}>
              <IconManager icon="ExpandLess" />
            </span>
          </Tooltip>
        </div>
      );
    }

    // all the component types we dont want to show filter group color on
    const excludeGrouping = [
      ComponentType.Actions,
      ComponentType.CaseNotes,
      ComponentType.CaseProperties,
      ComponentType.ChangeComponent,
      ComponentType.Wizard,
      ComponentType.TabNotes,
      ComponentType.IDVerification,
      ComponentType.Counter,
      ComponentType.AssureReport,
    ];
    const data = excludeGrouping.includes(el.data?.componentType) ? undefined : el?.data;
    //console.log(`rowid: ${el.rowId} component: ${data?.componentType}  color: ${ data?.filterGroupColor}`);
    return (
      <div
        key={el.rowId}
        data-grid={el}
        className={clsx(classes.componentDisplay, classes.shadowFade)}
        style={{
          boxShadow:
            (data?.filterGroupColor || "") === flashBackground
              ? `0px 0px 12px 12px ${flashBackground === "" ? "grey" : flashBackground}`
              : undefined,
        }}
        data-filtergroupcolor={el.data?.filterGroupColor || ""}
      >
        <FullScreen>
          {({ ref, onRequest }) => (
            <>
              <ComponentErrorBoundary
                rowId={el.rowId}
                onRemove={_onRemoveItem}
                componentName={el?.data?.componentType}
              >
                <div className="menuHover"></div>
                <div className="menuHoverContainer">
                  <div className={clsx(classes.menuColor, "menu")}>
                    {!props?.parent?.fixed ? (
                      <>
                        <Tooltip title="Remove">
                          <span onClick={() => _onRemoveItem(el.rowId)}>
                            <IconManager icon="Clear" className={clsx(classes.menuButton)} />
                          </span>
                        </Tooltip>
                        <Tooltip title="Maximize">
                          <span onClick={() => _onMaximizeItem(el)}>
                            <IconManager icon="AspectRatio" className={clsx(classes.menuButton)} />
                          </span>
                        </Tooltip>
                        <Tooltip title="Minimize">
                          <span onClick={() => _onMinimizeItem(el)}>
                            <IconManager icon="Minimize" className={clsx(classes.menuButton)} />
                          </span>
                        </Tooltip>
                        <Tooltip title="Configure">
                          <span onClick={() => _onConfigureItem(el)}>
                            <IconManager icon="Build" className={clsx(classes.menuButton)} />
                          </span>
                        </Tooltip>

                        {data && (
                          // using tippy instead of tooltip here as otherwise the tooltip can remain when the select list rendered / the menu hidden
                          <Tippy
                            content={data?.refreshInterval || refreshDropdownLists[0]}
                            placement="bottom"
                            className="MuiTooltip-tooltip css-bb4yjl-MuiTooltip-tooltip"
                            offset={[0, 14]}
                          >
                            <span>
                              <RefreshDropdown
                                items={refreshDropdownLists}
                                value={data?.refreshInterval || refreshDropdownLists[0]}
                                onChange={(e) => onRefreshChange(el, e.target.value)}
                                className={classes.refreshDropdown}
                              />
                            </span>
                          </Tippy>
                        )}

                        <Tooltip title="Change Component">
                          <span onClick={() => _onChangeComponent(el)}>
                            <IconManager icon="Edit" className={clsx(classes.menuButton)} />
                          </span>
                        </Tooltip>

                        {data && (
                          // using tippy instead of tooltip here as otherwise the tooltip can remain when the select list rendered / the menu hidden
                          <Tippy
                            content="Filter Group"
                            placement="bottom"
                            className="MuiTooltip-tooltip css-bb4yjl-MuiTooltip-tooltip" // TODO - is this css- class constant?
                            offset={[0, 14]}
                          >
                            <span>
                              <ColorDropdown
                                items={filterGroupColors}
                                value={data?.filterGroupColor || filterGroupColors[0]}
                                onChange={(e) => onColorChange(el, e.target.value)}
                                className={classes.colorDropdown}
                              />
                            </span>
                          </Tippy>
                        )}
                      </>
                    ) : null}

                    <Tooltip title="Go Fullscreen">
                      <span onClick={() => onRequest()}>
                        <IconManager icon="Fullscreen" className={clsx(classes.menuButton)} />
                      </span>
                    </Tooltip>
                  </div>

                  <div
                    className={clsx(classes.gridContainer)}
                    ref={ref}
                    style={{
                      overflowY: _overflowStyle(el),
                    }}
                  >
                    {<ComponentDisplay component={el} dataIsSet={_dataSet} />}
                  </div>
                </div>
              </ComponentErrorBoundary>
            </>
          )}
        </FullScreen>
      </div>
    );
  }

  function _overflowStyle(el) {
    return el?.data?.componentType === ComponentType.VirtualTable ? "hidden" : "auto";
  }

  function _onRemoveItem(rowId) {
    return trackPromise(service.remove(rowId), gridArea).then(() => {
      setLayout(layout.filter((i) => i.rowId !== rowId));
    });
  }

  function _dataSet(rowId, data) {
    const component = layout.find((x) => x.rowId === rowId);
    if (component && component?.data && data) {
      // trigger re-render
      // console.log("responsiveGrid toggle re-render from ", data.componentType);

      // we need to update the state on the cached component data in layout
      // otherwise things like filters from virtual table that have been applied since the grid load
      // will disappear if we do an action that "refreshes" the entire grid. i.e minimise / maximise components
      setLayout((prev) => {
        const newLayout = [...prev];

        const comp = newLayout.find((x) => x.rowId === rowId);
        if (comp) {
          comp.data = data;
          comp.json = JSON.stringify(data);
        }

        return newLayout;
      });
    }
  }

  function onColorChange(el, color) {
    // persist the filter group color
    let data = el.data;
    if (data) {
      data.filterGroupColor = color;
      // console.log(
      //   `saving color for rowid: ${el.rowId} ${data.componentType} as ${data.filterGroupColor}`
      // );
      trackPromise(service.json(el.rowId, el.data), gridArea);
      // re-render flashing background color
      setFlashBackground(color);
    }
  }

  function onRefreshChange(el, interval) {
    let data = el.data;
    const ind = layout.findIndex((i) => i.rowId === el.rowId);
    const newLayout = [...layout];
    newLayout[ind] = layout[ind];
    if (data) {
      data.refreshInterval = interval;
      console.log(
        `saving interval for rowid: ${el.rowId} ${data.componentType} as ${data.refreshInterval}`
      );
      trackPromise(service.json(el.rowId, el.data), gridArea).then(() => {
        setLayout(newLayout);
      });
      //_onChangeOnRefresh(newLayout,1,()=> setAddElement(false));
    }
  }

  function _onMinimizeItem(el) {
    const ind = layout.findIndex((i) => i.rowId === el.rowId);
    const newL = _.cloneDeep(layout[ind]);
    newL.prevH = newL.h;
    newL.prevMinH = newL.minH;
    newL.h = 1;
    newL.minH = 1;
    // create a new array and replace the changed element
    const newLayout = [...layout];
    newLayout[ind] = newL;
    _onChange(newLayout, null, () => setAddElement(false));
  }

  function _onRestoreItem(el) {
    const ind = layout.findIndex((i) => i.rowId === el.rowId);
    const newLayout = [...layout];
    const newL = _.cloneDeep(layout[ind]);
    newL.h = newL.data?.prevH || defaultHeight;
    newL.minH = newL.data?.prevMinH || minH;
    if (newL.data) {
      delete newL.data.prevH;
      delete newL.data.prevMinH;
    }
    newLayout[ind] = newL;
    _onChange(newLayout, null, () => setAddElement(false));
  }

  function _onMaximizeItem(el) {
    const cols = columns || 24;
    const screenHeight =
      Math.max(document.documentElement.clientHeight || 0, window.rowIdnnerHeight || 0) - 80;
    const screenBottom = Math.ceil(screenHeight / (rowHeight + 10)) - 1;
    const _layout = [...layout];
    let ind = _layout.findIndex((i) => i.rowId === el.rowId);
    let newL = _.cloneDeep(_layout[ind]);

    // width adjust
    const dimW = _layout.reduce(
      ({ l, lW, r, rW }, i) => {
        if (i.y + i.h <= el.y || i.y >= el.y + el.h)
          // ignore top/bottom outside range
          return { l: l, lW: lW, r: r, rW: rW };

        return {
          l: i.x < el.x && (i.x > l || l === 0) ? i.x : l, // get max x on left side
          lW: i.x < el.x && (i.x > l || l === 0) ? i.w : lW, // get max x width on left side
          r: i.x > el.x && i.x < r ? i.x : r, // get max x on right side
          rW: i.x > el.x && i.x < r ? i.w : rW, // get max x width on right side
        };
      },
      { l: 0, lW: 0, r: cols, rW: 0 }
    );
    const leftWidth = dimW.l + dimW.lW;
    const rightWidth = cols - dimW.r;
    newL.w = cols - leftWidth - rightWidth;
    if (leftWidth !== newL.x) newL.x = leftWidth;

    // height adjust
    const dimH = _layout.reduce(
      ({ t, tH, b, bH }, i) => {
        if (i.x + i.w <= el.x || i.x >= el.x + el.w)
          // ignore left/right outside range
          return { t: t, tH: tH, b: b, bH: bH };

        return {
          t: i.y < el.y && (i.y > t || t === 0) ? i.y : t, // get max y on top
          tH: i.y < el.y && (i.y > t || t === 0) ? i.h : tH, // get max y height on top
          b: i.y > el.y && i.y < b ? i.y : b, // get max y on bottom
          bH: i.y > el.y && i.y < b ? i.h : bH, // get max y height on bottom
        };
      },
      { t: 0, tH: 0, b: screenBottom, bH: 0 }
    );
    const topHeight = dimH.t + dimH.tH;
    const bottomHeight = screenBottom - dimH.b;
    newL.h = screenBottom - topHeight - bottomHeight;

    // create a new array and replace the changed element
    let newLayout = _layout.map((x) => x);
    newLayout[ind] = newL;
    _onChange(newLayout, null, () => setAddElement(false));
  }

  function _onConfigureItem(el) {
    let comp;
    if (el.data && el.data.componentType !== "Wizard") {
      let data = null;
      let wizardState = null;
      switch (el.data.componentType) {
        case ComponentType.VirtualTable:
          if (el.data.configureColumns) data = el.data.configureColumns[0];
          wizardState = WIZARD_STATE.CONFIGURE_COLUMNS;
          break;
        case ComponentType.TreeFilter:
          data = el.data.data[0];
          wizardState = WIZARD_STATE.CONFIGURE_TREE;
          break;
        case ComponentType.Counter:
          data = el.data.data;
          wizardState = WIZARD_STATE.CONFIGURE_COUNTER;
          break;
        default:
          wizardState = isChart(el.data.componentType, true)
            ? WIZARD_STATE.CONFIGURE_CHART
            : WIZARD_STATE.CHOOSE_COMPONENT;
          data = null;
      }
      comp = {
        componentType: wizardState === WIZARD_STATE.CONFIGURE_CHART ? "Chart" : "Wizard",
        wizardType: "Grid",
        data: data,
        wizardState: wizardState,
      };
      trackPromise(service.json(el.rowId, comp), gridArea).then(() => _loadGrid());
    } else {
      comp = {
        componentType: "Wizard",
        data: null,
        wizardState: WIZARD_STATE.CHOOSE_COMPONENT,
        wizardType: null,
      };
      trackPromise(service.json(el.rowId, comp), gridArea).then(() => _loadGrid());
    }
  }

  function _onChangeComponent(el) {
    if (el.data) {
      const subData = el.data?.data || el.data;
      const comp = {
        componentType: ComponentType.ChangeComponent,
        data: subData,
        wizardType: null,
      };
      trackPromise(service.json(el.rowId, comp), gridArea).then(() => _loadGrid());
    }
  }

  const children = layout.map((el) => _createElement(el));
  // const children = React.useMemo(() => layout.map((el) => _createElement(el)), [layout]);

  return (
    <div className={classes.mainGrid}>
      <LoadingSpinner area={gridArea} />

      {addElement ? null : (
        <ResponsiveReactGridLayout
          onLayoutChange={_onChange}
          draggableHandle=".menu"
          layout={layout}
          {...props}
          // rowHeight={30}
        >
          {children}
        </ResponsiveReactGridLayout>
      )}

      {!parent?.hideDial && (
        <SpeedDialMenu actions={menuActions} setSelectedOperation={setTemplateType} />
      )}
      <SaveTemplate open={openTemplate} setOpen={setOpenTemplate} templateType={templateType} />
      <AddReport open={openReport} setOpen={setOpenReport} />
      <ComponentErrorBoundary>
        <Portal>
          <HiddenOnState show={selectors.getShowHidden}>
            <FullScreen
              forceFullScreen={true}
              onChange={(visible) => {
                if (!visible) {
                  dispatch(showHiddenAction(false));
                }
              }}
            >
              {({ ref }) => (
                <div
                  ref={ref}
                  id="preview-fullscreen"
                  style={{
                    backgroundColor: "white",
                    overflowY: "auto",
                  }}
                >
                  <Preview
                    area="aaab"
                    fsiService={fsiService}
                    dataService={dataService}
                    isFullScreenInstance={true}
                  />
                </div>
              )}
            </FullScreen>
          </HiddenOnState>
        </Portal>
      </ComponentErrorBoundary>
    </div>
  );
}

export default ResponsiveGrid;
