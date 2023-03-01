import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import { useIdleTimer } from "react-idle-timer";
import { useHistory } from "react-router-dom";

interface IUserIdleProps {
  logout(): void;
  userTimeout: number;
}

const _intMax = 2147483646;
const UserIdle: React.FC<IUserIdleProps> = ({ logout, userTimeout }: IUserIdleProps) => {
  if (userTimeout > _intMax) userTimeout = _intMax;
  const [timeout] = useState(userTimeout);
  const [timedOut, setTimedOut] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [countDown, setCountDown] = useState(30);
  const timer = useRef<NodeJS.Timer>(); // had to make this a ref now using the timer hook.
  const history = useHistory();

  const setTimer = (t: NodeJS.Timer | undefined) => (timer.current = t);

  const onAction = () => {
    setTimedOut(false);
  };

  const onActive = () => {
    setTimedOut(false);
  };

  const onIdle = () => {
    if (!timedOut) {
      setShowModal(true);
      startModalTimer();
      idleTimer.reset();
      setTimedOut(true);
    }
  };

  const idleTimer = useIdleTimer({ timeout, onIdle, onActive, onAction });

  const _onReset = () => {
    idleTimer.reset();
  };

  const _onPause = () => {
    idleTimer.pause();
  };

  const _onResume = () => {
    idleTimer.resume();
  };

  // user events we fire to interact with idle timer
  // + audioprocess - fired continuously by wavesurfer when playing audio
  const events = [
    { event: "soteria.userIdle.timeoutReset", fn: _onReset },
    { event: "soteria.userIdle.timeoutPause", fn: _onPause },
    { event: "soteria.userIdle.timeoutResume", fn: _onResume },
    { event: "audioprocess", fn: _onReset },
  ];

  useEffect(() => {
    if (!timedOut) {
      events.forEach((x) => window.addEventListener(x.event, x.fn));
    }

    return () => {
      events.forEach((x) => window.removeEventListener(x.event, x.fn));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timedOut]);

  const startModalTimer = () => {
    if (timer.current) return;
    let remaining = countDown;
    const t = setInterval(() => {
      setCountDown((ct) => {
        remaining = ct - 1;
        return remaining;
      });

      if (remaining <= 0) {
        _modalLogout();
      }
    }, 1000);
    setTimer(t);
  };

  const clearTimer = () => {
    if (timer.current) {
      clearInterval(timer.current);
      setTimer(undefined);
    }
    setCountDown(30);
    setTimedOut(false);
  };

  const _modalClose = () => {
    clearTimer();
    setShowModal(false);
    idleTimer.reset();
  };

  const _modalLogout = () => {
    clearTimer();
    setShowModal(false);

    _logOut();
  };

  const _logOut = () => {
    logout();
    history.push({ pathname: "/login", search: "?timedOut=true" });
  };

  return (
    <>
      {/* <IdleTimer
        ref={(ref: IdleTimer) => {
          idleTimer.current = ref;
        }}
        element={document}
        onActive={_onActive}
        onIdle={_onIdle}
        onAction={_onAction}
        debounce={250}
        timeout={timeout}
      /> */}

      <IdleTimeOutModal
        showModal={showModal}
        handleClose={_modalClose}
        handleLogout={_modalLogout}
        remainingTime={countDown}
      />
    </>
  );
};
type CloseReason = "backdropClick" | "escapeKeyDown" | "closeButtonClick";

interface IdleTimeOutModalProps {
  showModal: boolean;
  handleClose: (reason: CloseReason) => void;
  handleLogout(): void;
  remainingTime: number;
}

const IdleTimeOutModal = ({
  showModal,
  handleClose,
  handleLogout,
  remainingTime,
}: IdleTimeOutModalProps) => {
  return (
    <Dialog open={showModal} onClose={(_, reason) => handleClose(reason)}>
      <DialogTitle>Session Timeout</DialogTitle>
      <DialogContent>
        <DialogContentText>
          You&rsquo;re being timed out due to inactivity. Click &quot;Stay signed in&quot; to remain
          logged in.
        </DialogContentText>
        <DialogContentText>Auto logout will occur in {remainingTime} seconds.</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleLogout} variant="contained">
          Logout
        </Button>
        <Button
          onClick={() => handleClose("closeButtonClick")}
          color="primary"
          autoFocus
          variant="contained"
        >
          Stay signed in
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserIdle;
