import React, { ReactElement, useEffect, useState } from "react";
import { Container, Typography } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { useHistory, useParams } from "react-router-dom";
import { componentService } from "./_services/componentService";
import ResponsiveGrid from "./ResponsiveGrid/ResponsiveGrid";
import { useStore } from "./_context/Store";
import { ITechDataWebMenuExtended } from "./Model/Extended/ITechDataWebMenuExtended";
import { ITechDataWebMenu } from "./Model/iTechRestApi/ITechDataWebMenu";
import { updateMenuListAction } from "./_context/actions/MenuActions";
import { ITechDataWebTab } from "./Model/iTechRestApi/ITechDataWebTab";
import { ITechDataWebTabExtended } from "./Model/Extended/ITechDataWebTabExtended";
import { applyFiltersAction } from "./_context/actions/PageDataActions";
import { AdvancedFilterModel } from "./Model/iTechRestApi/AdvancedFilterModel";
import { Filter } from "./Model/iTechRestApi/Filter";
import { DataSource } from "./Model/iTechRestApi/DataSource";
import DropDownMenu from "./Menu/DropDownMenu";
import { authenticationService } from "./_services/authenticationService";
import { logOutUserAction } from "./_context/actions/UserActions";
import { iTechDataTaskStatusEnum } from "./Model/iTechRestApi/iTechDataTaskStatusEnum";
import { iTechControlColumnEnum } from "./Model/iTechRestApi/iTechControlColumnEnum";
import { iTechDataWebTabEnum } from "./Model/iTechRestApi/iTechDataWebTabEnum";
import ComponentError from "./_helpers/ComponentError";
import { caseService } from "./_services/caseService";
import { updateSelectedCaseAction } from "./_context/actions/CaseActions";
import { Logo } from "./_components/Logo";
import { iTechDataCaseOutcomeEnum } from "./Model/iTechRestApi/iTechDataCaseOutcomeEnum";
import BusyButton from "./_components/BusyButton";
import { trackPromise } from "react-promise-tracker";
import { GetApp } from "@mui/icons-material";

const useStyles = makeStyles(() => ({
  logo: {
    height: "40px",
    marginTop: 3,
  },
  header: {
    display: "flex",
    height: 48,
  },
  title: {
    padding: "4px 0px 0px 10px",
  },
  downloadBtn: {
    margin: "4px 10px",
    height: 30,
  },
}));

const ReviewPage: React.FC = (): ReactElement => {
  const { caseId } = useParams<{ caseId: string }>();
  const tabTypeId = iTechDataWebTabEnum.review; // single tab row for this type
  const { dispatch, selectors } = useStore();
  const classes = useStyles();
  const history = useHistory();
  const [canRender, setCanRender] = useState(false); // prevent calls to load the tasks in grid until have the filters / case id set up
  const [zipFilePresent, setZipFilePresent] = useState(false);

  const _logout = () => {
    authenticationService.logout();
    dispatch(logOutUserAction());
    //history.push(`/review/${caseId}`);
    history.push(`/login`);
  };

  useEffect(() => {
    setCanRender(false);

    if (!caseId?.length) {
      throw new ComponentError(ReviewPage.displayName || "ReviewPage", "invalid path");
    }

    // access the case first to ensure authorized to do so
    caseService
      .get(Number(caseId))
      .then((result) => {
        sessionStorage.setItem("caseId", caseId);
        dispatch(updateSelectedCaseAction(result));
        return result;
      })
      .then(() => {
        const menu = new ITechDataWebMenu() as ITechDataWebMenuExtended;
        menu.selected = true;
        const tab = new ITechDataWebTab() as ITechDataWebTabExtended;
        tab.selected = true;
        tab.iTechDataCaseRowId = Number(caseId);
        tab.rowId = 1; // Needs a rowId set.. but not used for data retrieval.
        menu.iTechDataWebTabs = [tab];
        dispatch(updateMenuListAction([menu]));
        // apply a fixed filter - currently tasktype of manualReviewItem && status of done && outcome == successful
        const appliedFilters: AdvancedFilterModel = {
          dataSources: [
            {
              name: "iTechWebTask",
              filters: [
                // {
                //   iTechControlColumnTypeRowId: iTechControlColumnEnum.type,
                //   name: "iTechDataTaskTypeRowId",
                //   operation: "EQUALS",
                //   value: 3, // manual review
                // },
                {
                  iTechControlColumnTypeRowId: iTechControlColumnEnum.type,
                  name: "iTechDataTaskStatusTypeRowId",
                  operation: "EQUALS",
                  value: iTechDataTaskStatusEnum.done,
                },
                // {
                //   iTechControlColumnTypeRowId: iTechControlColumnEnum.string,
                //   name: "outcomeType",
                //   operation: "EQUALS",
                //   value: iTechDataTaskOutcomeEnum[iTechDataTaskOutcomeEnum.successful],
                // },
              ] as any[] as Filter[],
              rule: "AND",
            } as any as DataSource,
            {
              name: "iTechWebTask",
              filters: [
                {
                  iTechControlColumnTypeRowId: iTechControlColumnEnum.type,
                  name: "iTechDataTaskTypeRowId",
                  operation: "EQUALS",
                  value: 3, // manual review
                },
                {
                  iTechControlColumnTypeRowId: iTechControlColumnEnum.type,
                  name: "iTechDataTaskTypeRowId",
                  operation: "EQUALS",
                  value: 22, // auto review
                },
                //     {
                //       iTechControlColumnTypeRowId: iTechControlColumnEnum.string,
                //       name: "outcomeType",
                //       operation: "EQUALS",
                //       value: iTechDataTaskOutcomeEnum[iTechDataTaskOutcomeEnum.successful],
                //     },
                //     {
                //       iTechControlColumnTypeRowId: iTechControlColumnEnum.string,
                //       name: "outcomeType",
                //       operation: "EQUALS",
                //       value: iTechDataTaskOutcomeEnum[iTechDataTaskOutcomeEnum.cannotDelete],
                //     },
              ] as any[] as Filter[],
              rule: "OR",
            } as any as DataSource,
          ],
          id: "reviewPageFixedFilter",
          name: "Advanced",
          rowId: 8,
        };

        dispatch(applyFiltersAction(appliedFilters));
        setCanRender(true);
      });

    caseService.hasZipFile().then((rsp) => setZipFilePresent(rsp));
  }, [caseId]);

  const successfulCase =
    selectors.getSelectedCase()?.iTechDataCaseOutcomeTypeRowId ===
    iTechDataCaseOutcomeEnum.successful;

  const downloadZip = () => trackPromise(caseService.downloadZipFile(), zipDownloadArea);

  const zipDownloadArea = "zipDownload";

  return (
    <Container maxWidth="xl">
      <header className={classes.header}>
        <Logo />
        <Typography variant="h4" className={classes.title}>
          Review documents
        </Typography>
        {zipFilePresent && (
          <BusyButton
            color="primary"
            onClick={downloadZip}
            area={zipDownloadArea}
            startIcon={<GetApp />}
            className={classes.downloadBtn}
            // className={classes.downloadBtn}
          >
            Document zip
          </BusyButton>
        )}
        <DropDownMenu logoutHandler={_logout} menuExpanded={true} profileName="User" />
      </header>
      {!canRender && (
        <Typography variant="h5" gutterBottom>
          Loading...
        </Typography>
      )}
      {!successfulCase && (
        <Typography variant="h5" gutterBottom>
          Invalid case
        </Typography>
      )}
      {canRender && successfulCase && (
        <ResponsiveGrid
          parent={{ tabType: tabTypeId, fixed: true, hideDial: true }}
          service={componentService}
        />
      )}
    </Container>
  );
};
ReviewPage.displayName = "ReviewPage";
export default ReviewPage;
