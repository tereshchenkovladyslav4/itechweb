import { Theme } from "@mui/material";
import { useSelectors } from "../_context/selectors/useSelectors";

//const caseClosedColor = "#E23B18";

export const getCaseStatusStyle = (selectors: ReturnType<typeof useSelectors>, theme: Theme) =>
  selectors.getCaseClosed() ? { ...theme.palette.disable } : { ...theme.palette.primary };
