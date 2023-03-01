import { useEffect, useState } from "react";
import { ITechControlTable } from "../../Model/iTechRestApi/ITechControlTable";
import useIsMounted from "../../_helpers/hooks/useIsMounted";
import { updateDataSourcesAction } from "../actions/DataSourceActions";
// import { useSelectors } from "../selectors/useSelectors";
import { Immutable } from "../selectors/useSelectors";
import { useStore } from "../Store";

// export const getDataSources = async (
//   selectors: ReturnType<typeof useSelectors>,
//   service: () => Promise<ITechControlTable[]>,
//   dispatch: React.Dispatch<any>
// ): Promise<ITechControlTable[]> => {
//   let result = selectors.getDataSources();
//   if (!result?.length) {
//     result = await service();
//     dispatch(updateDataSourcesAction(result));
//   }
//   return result;
// };

// hook version ( is async so can return [] )
// updates stored datasources when not populated
export const useDataSources = (
  get: () => Promise<ITechControlTable[]>
): ReadonlyArray<Immutable<ITechControlTable>> => {
  const { selectors, dispatch } = useStore();
  const [data, setData] = useState(selectors.getDataSources());
  const isMounted = useIsMounted();

  useEffect(() => {
    if (selectors.getDataSources()?.length === 0) {
      (async () => {
        const newData = await get();
        if (isMounted()) {
          setData(newData);
          dispatch(updateDataSourcesAction(newData));
        }
      })();
    }
  }, []);

  return data;
};
