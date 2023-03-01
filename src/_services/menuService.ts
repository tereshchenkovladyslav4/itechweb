import config from "../config";
import { ITechDataWebFolderExtended } from "../Model/Extended/ITechDataWebFolderExtended";
import { ITechDataWebMenuExtended } from "../Model/Extended/ITechDataWebMenuExtended";
import { authHeader } from "../_helpers/authHeader";
import { handleResponse } from "../_helpers/handleResponse";
import { pathBuilder } from "../_helpers/pathBuilder";

export const menuService = {
  getAll,
  get,
  getCases,
  //selected,
  add,
  position,
  update,
  remove,
  edit,
  addFolder,
  getFolders,
  removeFolder,
  updateFolder,
};

// function getAll(): Promise<ITechDataWebMenuExtended[]> {
//   const requestOptions = { method: "GET", headers: authHeader() };
//   return fetch(`${config.apiUrl}/api/iTechDataWebMenu`, requestOptions)
//     .then(handleResponse)
//     .then((response: ITechDataWebMenuExtended[]) => {
//       response.forEach((m) => {
//         m.path = pathBuilder([m.name]);
//         if (m.iTechDataWebTabs) {
//           setTabPath(m.iTechDataWebTabs, m.path);
//         }
//       });
//       return response;
//     });
// }

function getAll(): Promise<ITechDataWebFolderExtended[]> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return fetch(`${config.apiUrl}/api/iTechDataWebMenu`, requestOptions)
    .then(handleResponse)
    .then((response: ITechDataWebFolderExtended[]) => {
      visitFolders(response, undefined, folderAction);

      return response;
    });
}

const folderAction = (folder: ITechDataWebFolderExtended, parent?: any) => {
  if (parent) {
    folder.path = pathBuilder([parent.path, folder.name]);
  } else {
    folder.path = pathBuilder([folder.name]);
  }
  if (folder.iTechDataWebMenus && folder.iTechDataWebMenus.length) {
    setMenuPath(folder.iTechDataWebMenus, folder.path);
  }
};

const visitFolders = (
  folders: ITechDataWebFolderExtended[],
  parent: any,
  action: (folder: ITechDataWebFolderExtended, parent: any) => void
) => {
  folders.forEach((f) => {
    action(f, parent);
    if (f.iTechDataWebFolders && f.iTechDataWebFolders.length) {
      visitFolders(f.iTechDataWebFolders, f, action);
    }
  });
};

function get(menuRowId: number): Promise<ITechDataWebMenuExtended> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return fetch(`${config.apiUrl}/api/iTechDataWebMenu/${menuRowId}`, requestOptions).then(
    handleResponse
  );
}

function getCases(): Promise<ITechDataWebMenuExtended[]> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return fetch(`${config.apiUrl}/api/iTechDataWebMenu`, requestOptions)
    .then(handleResponse)
    .then((response: ITechDataWebMenuExtended[]) => {
      const cases = response.filter((t) => t.iTechDataSecurityObjectRowId === null);

      cases.forEach((m) => {
        m.path = pathBuilder([m.name]);
        if (m.iTechDataWebTabs) {
          setTabPath(m.iTechDataWebTabs, m.path);
        }
      });
      return cases;
    });
}

function getFolders(rootTypes: number[]): Promise<ITechDataWebFolderExtended[]> {
  const requestOptions = { method: "GET", headers: authHeader() };

  const url = new URL(`${config.apiUrl}/api/iTechDataWebMenu/folders`);

  rootTypes.forEach((opt) => url.searchParams.append("folderTypes", opt.toString()));
  
  return fetch(url.toString(), requestOptions).then(handleResponse);
}

// function selected(rowId: number) {
//   const requestOptions = { method: "PATCH", headers: authHeader() };
//   return fetch(
//     `${config.apiUrl}/api/iTechDataWebMenu/selected/${rowId}`,
//     requestOptions
//   ).then(handleResponse);
// }

function add(menu: ITechDataWebMenuExtended): Promise<ITechDataWebMenuExtended> {
  const requestOptions = {
    method: "POST",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(menu),
  };
  return fetch(`${config.apiUrl}/api/iTechDataWebMenu`, requestOptions).then(handleResponse);
}

function addFolder(folder: ITechDataWebFolderExtended): Promise<ITechDataWebFolderExtended> {
  const requestOptions = {
    method: "POST",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(folder),
  };
  return fetch(`${config.apiUrl}/api/iTechDataWebMenu/addfolder`, requestOptions).then(
    handleResponse
  );
}

function position(rowId: number, position: number) {
  const requestOptions = { method: "PATCH", headers: authHeader() };
  return fetch(
    `${config.apiUrl}/api/iTechDataWebMenu/${rowId}?position=${position}`,
    requestOptions
  ).then(handleResponse);
}

function edit(rowId: number, name: string, icon: string, folderId?: number) {
  const requestOptions = { method: "PATCH", headers: authHeader() };
  return fetch(
    `${config.apiUrl}/api/iTechDataWebMenu/${rowId}?name=${name}&icon=${icon}&folderId=${folderId}`,
    requestOptions
  ).then(handleResponse);
}

function update(menus: ITechDataWebMenuExtended[]) {
  const requestOptions = {
    method: "PUT",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(menus),
  };
  return fetch(`${config.apiUrl}/api/iTechDataWebMenu`, requestOptions).then(handleResponse);
}

function remove(rowId: number) {
  const requestOptions = { method: "DELETE", headers: authHeader() };
  return fetch(`${config.apiUrl}/api/iTechDataWebMenu/${rowId}`, requestOptions).then(
    handleResponse
  );
}

function removeFolder(rowId: number) {
  const requestOptions = { method: "DELETE", headers: authHeader() };
  return fetch(`${config.apiUrl}/api/iTechDataWebMenu/folder/${rowId}`, requestOptions).then(
    handleResponse
  );
}

function updateFolder(rowId: number, folderId: number) {
  const requestOptions = { method: "PATCH", headers: authHeader() };
  return fetch(
    `${config.apiUrl}/api/iTechDataWebMenu/folder/${rowId}?folderId=${folderId}`,
    requestOptions
  ).then(handleResponse);
}

// const recurseTabPath = (arr: any, previousPath: any) => {
//   arr.forEach((item: any) => {
//     if (previousPath !== null) {
//       item.path = pathBuilder([previousPath, item.name]);
//     }
//     if (item.iTechDataWebTabChild) {
//       recurseTabPath(item.iTechDataWebTabChild, item.path);
//     }
//   });
// };

const setTabPath = (arr: any, menuName: any) => {
  arr.forEach((item: any) => {
    if (item && item.iTechDataWebTabParentRowId == null) {
      item.path = pathBuilder([menuName, item.name]);
    } else {
      //we have a child
      arr.forEach((parent: any) => {
        if (parent.rowId == item.iTechDataWebTabParentRowId) {
          item.path = pathBuilder([parent.path, item.name]);
        }
      });
    }
  });
};

// traverse menu / tab hierarchy setting path extended property for each item
const setMenuPath = (iTechDataWebMenus: ITechDataWebMenuExtended[], path: string) => {
  iTechDataWebMenus.forEach((item) => {
    item.path = pathBuilder([path, item.name]);
    setTabPath(item.iTechDataWebTabs, item.path);
  });
};
