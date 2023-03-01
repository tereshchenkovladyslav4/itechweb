import React, { ReactElement, useState, useEffect } from "react";
import { useStyles } from "./IDVerification.styles";
import { caseService } from "../_services/caseService";
import { trackPromise } from "react-promise-tracker";
import { throwError } from "rxjs";
import useIsMounted from "../_helpers/hooks/useIsMounted";
import { ITechDataCase } from "../Model/iTechRestApi/ITechDataCase";
import CaseUser from "./CaseUser";
import UserProfile from "./UserProfile";
import { ciEquals } from "../_helpers/utilities";
import { userService } from "../_services/userService";
import { hrService } from "../_services/hrService";
import { ITechWebHr } from "../Model/iTechRestApi/ITechWebHr";
import { ITechDataUser } from "../Model/iTechRestApi/ITechDataUser";

type IDVerificationProps = {
  caseId?: number;
  investigationId:
    | {
        rowId: number | undefined;
        datasource: string;
      }
    | undefined;
  service: typeof caseService;
  area?: string;
};

const IDVerification: React.FC<IDVerificationProps> = ({
  caseId,
  investigationId,
  service,
  area,
}): ReactElement => {
  const isMounted = useIsMounted();
  const classes = useStyles();
  const [selectedCase, setSelectedCase] = useState<ITechDataCase | undefined>(undefined);
  const [user, setUser] = useState<ITechDataUser | undefined>(undefined);
  const [hr, setHr] = useState<ITechWebHr[]>([]);

  useEffect(() => {
    if (caseId && isMounted()) {
      trackPromise(service.get(caseId), area)
        .then((result) => {
          if (isMounted()) {
            setSelectedCase(result);
          }
        })
        .catch((error) => {
          throwError(new Error(error?.message || error));
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseId]);

  useEffect(() => {
    if (
      investigationId?.rowId !== undefined &&
      ciEquals(investigationId?.datasource, "user") &&
      isMounted()
    ) {
      userService.get(investigationId.rowId).then((rsp) => {
        setUser(rsp);
      });
      hrService.getUser(investigationId.rowId).then((rsp) => {
        setHr(rsp);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [investigationId]);

  return (
    <div className={classes.component}>
      {selectedCase && <CaseUser selectedCase={selectedCase} />}
      {user && <UserProfile user={user} HRs={hr} />}
    </div>
  );
};

IDVerification.displayName = "IDVerification";

export default IDVerification;
