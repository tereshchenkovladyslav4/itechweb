import { useState, useCallback } from "react";

const useAsyncError = (): (e: any) => void => {
    const [, setError] = useState();
    return useCallback(
        e => {
            setError(() => {
                throw e;
            });
        },
        [setError],
    );
};

export default useAsyncError;