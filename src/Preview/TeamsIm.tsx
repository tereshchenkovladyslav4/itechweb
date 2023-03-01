import React from "react";
import { useStyles } from "./TeamsIm.styles";
import { MsGraphGetChatMsgResponse } from "../Model/iTechRestApi/MsGraphGetChatMsgResponse";
import moment from "moment";
import { MsGraphChatMsgReaction } from "../Model/iTechRestApi/MsGraphChatMsgReaction";
import { distinctBy } from "../_helpers/utilities";
import { fsiService } from "../_services/fsiService";
import { TinyButton } from "../_components/TinyButton";

interface ITeamsImProps {
  messages: MsGraphGetChatMsgResponse[];
  simRowId: string | number;
}

const TeamsIm: React.FC<ITeamsImProps> = ({ messages, simRowId }) => {
  const classes = useStyles();
  const _dateFormat = "DD/MM/YYYY HH:mm";

  const _reactionIcons = [
    { type: "like", display: "👍" },
    { type: "angry", display: "😡" },
    { type: "sad", display: "☹" },
    { type: "laugh", display: "😄" },
    { type: "heart", display: "❤" },
    { type: "surprised", display: "😮" },
  ];

  const _reaction = (reactions: MsGraphChatMsgReaction[]) => {
    const icons = _reactionIcons.filter((x) => reactions?.some((r) => r.reactionType === x.type));
    return icons
      .map((x) => `${x.display} ${reactions?.filter((r) => r.reactionType === x.type)?.length}`)
      .join(" ");
  };

  const _pdfUrl = (etag: string) => fsiService.getTeamsPDF(simRowId, etag);

  const unique = distinctBy(messages, "id") as MsGraphGetChatMsgResponse[];
  return (
    <div className={classes.container}>
      {unique?.length === 0 && "No messages found"}
      {unique?.map((m, i) => (
        <div className={classes.message} key={i}>
          <div className={classes.reactions}>{_reaction(m.reactions)}</div>
          <div className={classes.user}>{m.from?.user?.displayName}</div>
          <div className={classes.date}>
            {moment(m?.createdDateTime).format(_dateFormat)}
            <a href={_pdfUrl(m?.etag)} target="_blank" rel="noreferrer">
              <TinyButton
                icon="Settings"
                color="primary"
                style={{ marginTop: -4, marginLeft: 8 }}
              />
            </a>
          </div>
          {
            <div
              className={classes.body}
              dangerouslySetInnerHTML={{ __html: m.body?.content }}
            ></div>
          }
        </div>
      ))}
    </div>
  );
};
export default TeamsIm;
