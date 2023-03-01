import { Grid } from "@mui/material";
import React, { useState, useEffect } from "react";
import { trackPromise } from "react-promise-tracker";
import LoadingSpinner from "../_components/LoadingSpinner";
import { authTokenQueryParam } from "../_helpers/authHeader";
import useIsMounted from "../_helpers/hooks/useIsMounted";
import { fsiService } from "../_services/fsiService";
import MediaPlayer from "./MediaPlayer";
import config from "../config";

interface IVideoPlayerProps {
  fsiGuid: string;
  rowId?: number;
  service: typeof fsiService;
  area: string;
}

const VideoPlayer: React.FC<IVideoPlayerProps> = ({ fsiGuid, rowId, service, area }) => {
  const isMounted = useIsMounted();

  const [files, setFiles] = useState<Array<{ path: string; mimeType: string }>>();
  const [id] = useState("videoplayer-" + Math.floor(Math.random() * 1000));

  // getting the file paths required a call to api to process the zip file
  useEffect(() => {
    setFiles(undefined);
    trackPromise(service.videoContent(fsiGuid), area).then((result) => {
      if (!isMounted()) return;
      setFiles(result);
    });
  }, [fsiGuid]);

  const audio = files?.find((x) => x.mimeType.includes("audio"));
  const videos = files?.filter((x) => x !== audio);

  const getFullPath = (path: string) => `${config.apiUrl}/api/iTechFsi/file/${path}`;

  if (!files) return <LoadingSpinner area={area} fixed={false} />;

  const getVideoPlayers = () => document.getElementById(id)?.getElementsByTagName("video");

  const onPlay = (pos: number) => {
    const players = getVideoPlayers();
    if (players) {
      for (const p of players) {
        p.currentTime = pos;
        p.play();
      }
    }
  };

  const onPause = (pos: number) => {
    const players = getVideoPlayers();
    if (players) {
      for (const p of players) {
        p.pause();
        p.currentTime = pos;
      }
    }
  };

  const onSeek = (pos: number) => {
    const players = getVideoPlayers();
    if (players) {
      for (const p of players) {
        p.currentTime = pos;
      }
    }
  };

  return (
    <div id={id} style={{ padding: 4 }}>
      {audio?.path && (
        <MediaPlayer
          path={authTokenQueryParam(getFullPath(audio.path))}
          rowId={rowId}
          callback={{ onPlay, onPause, onSeek }}
        >
          <Grid container spacing={1} alignContent="center">
            {videos &&
              videos.map((p, i) => (
                <Grid item xs key={i}>
                  <video
                    src={authTokenQueryParam(getFullPath(p.path))}
                    width="424"
                    // height="240"
                    controls={audio ? undefined : true}
                    preload="auto"
                    muted={audio ? true : undefined}
                  >
                    Your browser does not support the video tag.
                  </video>
                </Grid>
              ))}
          </Grid>
        </MediaPlayer>
      )}
      {/* When we dont have any audio for some reason */}
      {!audio?.path && (
        <Grid container spacing={1} alignContent="center">
          {videos &&
            videos.map((p, i) => (
              <Grid item xs key={i}>
                <video
                  src={authTokenQueryParam(getFullPath(p.path))}
                  width="424"
                  // height="240"
                  controls={audio ? undefined : true}
                  preload="auto"
                  muted={audio ? true : undefined}
                >
                  Your browser does not support the video tag.
                </video>
              </Grid>
            ))}
        </Grid>
      )}
    </div>
  );
};

VideoPlayer.displayName = "VideoPlayer";
export default VideoPlayer;
