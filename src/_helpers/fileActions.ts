import { History } from "history";
import { TableEnum } from "../Model/iTechRestApi/TableEnum";

export const onOpenFullscreen = <T>(
  gid: T,
  showHidden: () => void,
  onSelectClick: (gid: T, tableReference: any) => Promise<void>,
  rowData: any = undefined
): void => {
  // invoke hidden preview
  onSelectClick(gid, rowData).then(() => showHidden());
};

export const onOpenNewTab = (
  history: History,
  gid: string,
  dataSource: string = TableEnum[TableEnum.iTechWebSim]
): void => {
  history.push(`/file=${gid}/${dataSource}?properties`);
};

export const onOpen = <T>(
  gid: T,
  onSelectClick: (gid: T, rowData: any) => Promise<void>,
  rowData: any = undefined
): void => {
  const existingPreviewOrProperties = hasPreviewOrProperties();
  if (existingPreviewOrProperties) {
    onSelectClick(gid, rowData);
  } else {
    // create new preview ?
  }
};

export const hasPreviewOrProperties = (filterGroupColor = ""): boolean => {
  const els = document.querySelectorAll(
    "[data-testid='component-nav-header'], [data-testid^='preview'], [data-testid^='properties'], [data-testid^='actions']"
  );

  if (els === null || els.length === 0) return false;

  for (let index = 0; index < els.length; index++) {
    const element = els[index];
    if (element.parentElement?.parentElement?.parentElement?.dataset["filtergroupcolor"] ===
    filterGroupColor)
      return true;
    
  }
  return false;
};
