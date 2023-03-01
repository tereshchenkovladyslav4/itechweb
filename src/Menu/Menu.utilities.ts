import { ComponentType } from "../ComponentDisplay/componentType";
import { ITechDataWebComponentExtended } from "../Model/Extended/ITechDataWebComponentExtended";
import { ITechDataWebMenuExtended } from "../Model/Extended/ITechDataWebMenuExtended";
import { ITechDataWebTabExtended } from "../Model/Extended/ITechDataWebTabExtended";
import { ITechDataWebTab } from "../Model/iTechRestApi/ITechDataWebTab";
import { fullWidth, getFullHeight, getNextTabName } from "../_helpers/tabName";
import { componentService } from "../_services/componentService";
import { tabService } from "../_services/tabService";
import { History } from 'history';
import { RouteProps } from "react-router-dom";

export function GetMenuOrCreateTabForFilePath(
  location: RouteProps["location"],
  menuList: ITechDataWebMenuExtended[],
  isFileRoute: boolean,
  setIsFileRoute:(value: React.SetStateAction<boolean>) => void,
  history:History<unknown>,
  onSetCurrentMenu: (menu?: ITechDataWebMenuExtended | undefined) => void,
): ITechDataWebMenuExtended {

  const menu = menuList.find((m) => m.selected === true) || menuList[0];

  if (location?.pathname === "/") return menu;

  const paths = location?.pathname.split("/");

  // url format - /file=${gid}/${dataSource}?properties
  const FilePath = "file=";
  if (!isFileRoute && paths && paths.length > 0 && paths[1]?.toLowerCase().startsWith(FilePath)) {
    setIsFileRoute(true);
    const hasParam = (location?.search?.length || 0) > 0;
    const fileId = paths[1].substring(FilePath.length);
    // checks if tab with the file id exists in component json for user
    const ds = paths[2];

    componentService.userHasComponentTab(`{"FileId":"${fileId}","datasource":"${ds}"}`).then((response) => {
      if (response) {
        // go to the existing tab
        const path = `/${response.menuName.toLowerCase()}/${response.tabName.toLowerCase()}`.replace(/ /g, '_');
        history.push(path);
        setIsFileRoute(false);
        return;
      }

      // get sequential tab name
      const newTabName = getNextTabName(menu?.iTechDataWebTabs, "File preview ");
      // only add first pass through..
      if (!menu.iTechDataWebTabs.some((x) => x.name === newTabName)) {
        menu.iTechDataWebTabs.forEach((tab: any) => (tab.selected = false));

        const newTab = new ITechDataWebTab() as ITechDataWebTabExtended;
        newTab.position = menu.iTechDataWebTabs.length;
        newTab.name = newTabName;
        newTab.isHightlighted = true;
        newTab.iTechDataWebMenuRowId = menu.rowId;

        if (menu?.iTechDataWebTabs?.length) {
          newTab.iTechDataCaseRowId = menu.iTechDataWebTabs[0].iTechDataCaseRowId;
        }

        const componentData = { FileId: fileId, datasource:ds };

        tabService.add(newTab).then((resultTab) => {
          const tab = resultTab as ITechDataWebTabExtended;
          menu?.iTechDataWebTabs.push(tab);
          tab.path = menu?.path + "/" + tab.name.toLowerCase().replace(/ /g, "_");
          const route = tab.path;

          const preview = {
            componentType: ComponentType.Preview,
            wizardType: "Preview",
            data: componentData,
          };
          let width = fullWidth;
          let createProperties = false;

          if (hasParam) {
            const param = location?.search.substring(1);
            if (param?.toLowerCase() === "properties") {
              width /= 2;
              createProperties = true;
            }
          }
          const component = {
            x: 0,
            y: 0,
            w: width,
            h: getFullHeight(),
            iTechDataWebTabRowId: tab.rowId,
            json: JSON.stringify(preview),
          } as ITechDataWebComponentExtended;

          const promises = [];
          promises.push(componentService.add(component));

          if (createProperties) {
            const properties = {
              componentType: ComponentType.Properties,
              wizardType: "Properties",
              data: componentData,
            };

            const propertiesComponent = {
              x: width,
              y: 0,
              w: width,
              h: getFullHeight(),
              iTechDataWebTabRowId: tab.rowId,
              json: JSON.stringify(properties),
            } as ITechDataWebComponentExtended;

            promises.push(componentService.add(propertiesComponent));
          }

          Promise.all(promises).then(() => {
            history.push(route);
            // finished processing file route
            setIsFileRoute(false);
          });
        });
      }
    });
  }
  return menu;
}
