import React, { useEffect, useState } from "react";
import { useStyles } from "./TeamsIm.styles";
import moment from "moment";
import { fsiService } from "../_services/fsiService";
import { BloombergIm } from "../Model/iTechRestApi/BloombergIm";
import { trackPromise } from "react-promise-tracker";
import useIsMounted from "../_helpers/hooks/useIsMounted";

interface IBloomBermImProps {
  service: typeof fsiService;
  simRowId: string | number;
  fsiGuid: string;
  area: string;
}

const BloomBergIm: React.FC<IBloomBermImProps> = ({ service, simRowId, area, fsiGuid }) => {
  const classes = useStyles();
  const isMounted = useIsMounted();
  const [messages, setMessages] = useState<BloombergIm[]>();
  const _dateFormat = "DD/MM/YYYY HH:mm";

  useEffect(() => {
    if (fsiGuid) {
      trackPromise(service.bloombergim(simRowId, fsiGuid), area).then((result) => {
        if (isMounted()) {
          setMessages(result);
        }
      });
    }
  }, [simRowId, fsiGuid]);

  return (
    <div className={classes.container}>
      {messages?.length === 0 && "No messages found"}
      {messages?.map((m, i) => (
        <div className={classes.message} key={i}>
          <div className={classes.user}>{m.username}</div>
          <div className={classes.date}>{moment(m?.dateTime).format(_dateFormat)}</div>
          <div className={classes.body}>{m.content}</div>
        </div>
      ))}
    </div>
  );
};
export default BloomBergIm;
