import React, { useEffect } from "react";
import { RouteProps, useHistory } from "react-router-dom";
import { folderService } from "./_services/folderService";

type CaseRedirectProps = {
  location: RouteProps["location"];
};

const CaseRedirect: React.FC<CaseRedirectProps> = ({ location }) => {
  const history = useHistory();

  useEffect(() => {
    const paths = location?.pathname?.split("/").filter((x) => x.length > 0);

    if (!paths || paths?.length < 2 || paths[0] !== "cases") return;

    folderService.casePath(paths[1]).then((folder) => {
      // TODO: use case ID rather than case reference
      history.push(`/${folder.path}`);
    });
  }, []);

  return <div>Redirecting...</div>;
};

export default CaseRedirect;
