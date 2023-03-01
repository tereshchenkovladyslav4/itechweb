import { StoreContextState, IErrorData } from "../types/StoreContextState";

const initialErrorData: IErrorData = {
  showDialog: false,
  componentName: "",
  error: "",
  errorInfo: "",
};

const InitialState: StoreContextState = {
  pageData: new Map(),
  errorData: initialErrorData,
  templates: [],
  menuList: [],
  showHidden: false,
  selectedCase: undefined,
  dataSources:[],
  folderList: [],
};

export default InitialState;
