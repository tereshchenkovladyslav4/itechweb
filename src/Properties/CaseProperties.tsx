import React, { useState, useEffect } from "react";
import { trackPromise } from "react-promise-tracker";
import { ITechWebCaseManagement } from "../Model/iTechRestApi/ITechWebCaseManagement";
import Waiting from "../_components/Waiting";
import useIsMounted from "../_helpers/hooks/useIsMounted";
import { dataService } from "../_services/dataService";
import ListDisplay from "./ListDisplay";
import { on, off, RefreshTableEvent } from "../_helpers/events";
import { useStyles } from "./ListDisplay.styles";

interface ICasePropertiesProps {
  dataService: typeof dataService;
  caseId?: number;
  area?: string;
}

const CaseProperties: React.FC<ICasePropertiesProps> = ({ dataService, caseId, area }) => {
  const classes = useStyles();
  const [currentCase, setCurrentCase] = useState<ITechWebCaseManagement>();
  const isMounted = useIsMounted();

  const _handleRefreshTable = () => {
    _loadCaseData();
  };

  // respond to ownership change in Case Dashboard
  useEffect(() => {
    on(RefreshTableEvent, _handleRefreshTable);
    return () => {
      off(RefreshTableEvent, _handleRefreshTable);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    _loadCaseData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseId]);

  const _loadCaseData = () => {
    if (!caseId) return;
    trackPromise(dataService.gid("ITechWebCaseManagement", caseId.toString()), area).then((rsp) => {
      if (isMounted()) {
        setCurrentCase(rsp as ITechWebCaseManagement);
      }
    });
  };

  const getProperties = (): { key: string; value: any }[] => {
    if (!currentCase) return [];

    const keys = currentCase && Object.keys(currentCase);

    // simulate the structure from iTechControlColumn so we can replace this with service call
    const columns = [
      { name: "name", description: "Name", gridIndex: 1 },
      { name: "summary", description: "Summary", gridIndex: 2 },
      // { name: "caseStatusTypeAbb", description: "Case Status", gridIndex:3 },
      { name: "securityObject", description: "Owner", gridIndex: 4 },
      { name: "investigator", description: "Investigator", gridIndex: 5 },
      // { name: "caseTypeAbb", description: "Case Type", gridIndex:6 },
      // { name: "caseStatusSubTypeAbb", description: "Status Sub Type", gridIndex:7 },
      {
        name: "dateInitiatedString",
        description: "Date Initiated",
        gridIndex: 7,
      },
      {
        name: "dateDueString",
        description: "Date Due",
        gridIndex: 8,
      },
      {
        name: "dateInsertedString",
        description: "Date Inserted",
        gridIndex: 9,
      },
      // { name: "subjectName", description: "Subject Name", gridIndex:9 },
      {
        name: "caseStatusTypeDescription",
        description: "Case Status Description",
        gridIndex: 10,
      },
      {
        name: "caseTypeDescription",
        description: "Case Type Description",
        gridIndex: 11,
      },
      {
        name: "caseStatusSubTypeDescription",
        description: "Status Sub Type Description",
        gridIndex: 12,
      },
      { name: "caseReference", description: "Case Reference", gridIndex: 13 },
      { name: "legalHold", description: "Legal Hold", gridIndex: 14 },
      {
        name: "dateModifiedString",
        description: "Date Modified",
        gridIndex: 15,
      },
      {
        name: "dateArchivedString",
        description: "Date Archived",
        gridIndex: 16,
      },
      // { name: "subjectEmail", description: "Subject Email", gridIndex:17 },
      // { name: "subjectAddress", description: "Subject Address", gridIndex:18 },
      // { name: "subjectMobile", description: "Subject Mobile", gridIndex:19 },
      // { name: "subjectPhone", description: "Subject Phone", gridIndex:20 },
    ];

    const displayKeys =
      keys?.filter((k) =>
        columns?.some((c) => c.name === k && c.gridIndex && (currentCase as any)[k] !== null)
      ) || [];

    const dict = displayKeys.map((k: string): { key: string; value: any } => ({
      key: columns.find((c) => c.name === k)?.description || "",
      value: (currentCase as any)[k],
    }));

    return dict;
  };
  const dict = getProperties();

  return (
    <div data-testid={"caseproperties-" + caseId} className={classes.root}>
      {dict ? <ListDisplay dict={dict} /> : <Waiting />}
    </div>
  );
};

export default CaseProperties;
