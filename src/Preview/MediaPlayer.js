import React, { Component, createRef } from "react";
import clsx from "clsx";
import { emphasize } from "@mui/material/styles";
import withStyles from '@mui/styles/withStyles';
import WaveSurfer from "wavesurfer.js";
import Countdown from "../_components/Countdown";
import { Fab, CircularProgress, Box } from "@mui/material";
import IconManager from "../_components/IconManager";
import "./MediaPlayer.css";
import { transcriptService } from "../_services/transcriptService";
import Transcript from "./Transcript";
import { Alert } from '@mui/material';

const styles = (theme) => ({
  fab: {
    margin: "auto 5px",
    minWidth: 56,
    minHeight: 56,
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.light,
    zIndex: 4,
    "&:hover": {
      backgroundColor: emphasize(theme.palette.primary.main, 0.15),
    },
  },
  countdown: {
    margin: "49px 10px 0 0",
    height: "75%",
    fontFamily: theme.typography.fontFamily,
  },
});

const CircularProgressLoading = () => {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress />
    </Box>
  );
};

const PLAY_STATE = {
  paused: {
    icon: "PlayArrow",
  },
  playing: {
    icon: "Pause",
  },
  replay: {
    icon: "Replay",
  },
};

// Props:
// {
//  path: string
//  rowId: number
//  callback? - optional {onSeek(pos: number), onPlay(pos: number), onPause(pos: number)}
//  theme - passed in voa HOC { withTheme: true }
//}

class MediaPlayer extends Component {
  constructor(props) {
    super(props);
    this.ref = createRef();
    this.id = "waveform-" + Math.floor(Math.random() * 1000);
  }

  state = {
    playState: PLAY_STATE.paused,
    duration: 0,
    timeLeft: 0,
    replay: false,
    width: this.ref?.current?.clientWidth || 0,
    loadPercent: 0,
    error: "",
  };

  componentDidMount() {
    var canvas2d = document.createElement("canvas").getContext("2d");

    var gradient = canvas2d?.createLinearGradient(0, 0, 0, 140);
    if (gradient) {
      gradient.addColorStop(0, "yellow");
      gradient.addColorStop(1, this.props.theme.palette.primary.main);
      // gradient.addColorStop(1, this.props.theme.palette.secondary.main);
    }

    this.waveform = WaveSurfer.create({
      barWidth: 2,
      barHeight: 1.9,
      barMinHeight: 1,
      cursorWidth: 1,
      container: `#${this.id}`,
      backend: "WebAudio",
      height: 200,
      progressColor: gradient,
      responsive: true,
      waveColor: this.props.theme.palette.disable.main,
      cursorColor: "transparent",
    });
    this.waveform.on("ready", this._handleReady);
    this.waveform.on("audioprocess", () => this._handleProcess(this.waveform.isPlaying()));
    this.waveform.on("seek", () => this._handleProcess(true, this.props?.callback?.onSeek));
    this.waveform.on("play", this._handlePlayState);
    this.waveform.on("pause", this._handlePauseState);
    this.waveform.on("finish", this._handleFinishState);
    this.waveform.on("error", this._handleError);
    // TODO: load bar.. currently this just displays a spinner as percantage reported back only after fetch complete & while control reading data
    this.waveform.on("loading", this._handleLoadProgress);

    if (this.ref?.current?.clientWidth) {
      this.setState({
        playState: PLAY_STATE.paused,
        duration: 0,
        timeLeft: 0,
        replay: false,
        width: this.ref?.current?.clientWidth,
        loadPercent: 0,
      });
    }
    this._loadWaveform(this.props.path);
  }

  componentDidUpdate(prevProps) {
    const width = this.ref.current.clientWidth;
    if (prevProps.path !== this.props.path) {
      this.waveform.empty();

      this.setState(
        {
          playState: PLAY_STATE.paused,
          duration: 0,
          timeLeft: 0,
          replay: false,
          width: width,
          loadPercent: 0,
          error: "",
        },
        this._loadWaveform(this.props.path)
      );
    } else if (width !== this.state.width) {
      this.setState({
        width: width,
      });
      this.waveform.drawBuffer();
    }
  }

  componentWillUnmount() {
    this.waveform._onResize.clear();
    this.waveform.destroy();
  }

  _loadWaveform(path) {
    if (!path) return;

    this.waveform.load(path);
  }

  _handleLoadProgress = (percent, xhr) => {
    this.setState({ loadPercent: percent });
  };

  _handleFinishState = () => {
    this.setState({ playState: PLAY_STATE.replay, replay: true });
  };

  _handlePauseState = () => {
    if (!this.state.replay) {
      this.setState({ playState: PLAY_STATE.paused });
    }
  };

  _handlePlayState = () => {
    this.setState({ playState: PLAY_STATE.playing });
  };

  _handleReady = () => {
    const duration = this.waveform.getDuration().toFixed(0);
    this.setState({ duration: duration, timeLeft: duration, error: "" });
  };

  // just passed a string
  _handleError = (error) => {
    this.setState({ duration: 0, timeLeft: 0, error: "Failed to load audio file" });
    this.waveform.empty();
    this.waveform.drawer.clearWave();
  };

  _handleProcess = (handle, onSeek) => {
    const timeLeft =
      this.waveform.getDuration().toFixed(0) - this.waveform.getCurrentTime().toFixed(0);

    if (!!handle && this.state.timeLeft === timeLeft) return;

    if (onSeek) {
      onSeek(this.waveform.getCurrentTime());
    }

    this.setState({
      timeLeft: timeLeft,
      playState: this.waveform.isPlaying() ? PLAY_STATE.playing : PLAY_STATE.paused,
    });
  };

  _handlePlay = () => {
    this.waveform.playPause();

    if (this.props?.callback) {
      const time = this.waveform.getCurrentTime();
      this.waveform.isPlaying()
        ? this.props.callback?.onPlay(time)
        : this.props.callback?.onPause(time);
    }

    this.setState({ replay: false });
  };

  // seek from the transcript
  _seek = (timePos) => {
    if (this.waveform) {
      this.waveform.setCurrentTime(timePos);
      if (this.props?.callback) {
        this.props.callback?.onSeek(timePos);
      }
    }
  };

  _currentPosition = () => (this.waveform ? this.waveform.getCurrentTime() : 0);

  _showLoading = () => this.state.duration === 0 && this.state.error === "";

  render() {
    const { classes } = this.props;
    return (
      <>
        {this.state.error && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Alert severity="error">{this.state.error}</Alert>
          </div>
        )}

        <div className="waveformContainer" ref={this.ref}>
          <Fab
            size="large"
            role="playpause"
            onClick={this._handlePlay}
            className={clsx(classes.fab)}
          >
            {<IconManager icon={this.state.playState.icon} />}
          </Fab>
          <div
            id={this.id}
            data-testid={this.id}
            style={{ visibility: this._showLoading() ? "hidden" : null }}
          />
          {this._showLoading() && (
            <div style={{ position: "absolute", top: "150px" }}>
              <CircularProgressLoading />
            </div>
          )}

          <div className={classes.countdown}>
            <Countdown
              duration={this.state.duration}
              timeLeft={this.state.timeLeft}
              completed={this.state.playState === PLAY_STATE.replay}
            />
          </div>
        </div>

        {this.props.children && this.props.children}

        {this.props.rowId !== undefined && (
          <Transcript
            rowId={this.props.rowId}
            service={transcriptService.get}
            seek={this._seek}
            currentPosition={this._currentPosition}
            playing={this.state.playState === PLAY_STATE.playing}
          />
        )}
      </>
    );
  }
}

export default withStyles(styles, { withTheme: true })(MediaPlayer);
