import { ITableFormProps } from "./ITableFormProps";

export interface ITableActionProps extends ITableFormProps {
  caseId: number | undefined;
  dispatch: React.Dispatch<any>;
}
