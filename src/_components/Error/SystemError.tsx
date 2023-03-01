import React from 'react';
import { useStore } from "../../_context/Store";
import StackError from "./StackError";
import FetchError from "./FetchError";

export interface IErrorProps {
    componentId?: number;
    onRemove?(rowId:number):Promise<void>;
}

const SystemError: React.FC<IErrorProps> = ({componentId, onRemove}) => {
    const { state } = useStore();
    return (
        <>
            {
                (state.errorData.errorInfo)
                    ? <StackError componentId={componentId} onRemove={onRemove}/>
                    : <FetchError componentId={componentId} onRemove={onRemove}/>
            }
        </>
    )
};

export default SystemError;