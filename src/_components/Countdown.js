import React from "react";
import "./Countdown.css";

export default function Countdown(props) {
  const { duration, timeLeft, completed, completedText } = props;
  const FULL_DASH_ARRAY = 283;
  const WARNING_THRESHOLD = 10;
  const ALERT_THRESHOLD = 5;
  const COLOR_CODES = {
    info: {
      class: "info",
    },
    warning: {
      class: "warning",
      threshold: WARNING_THRESHOLD,
    },
    alert: {
      class: "alert",
      threshold: ALERT_THRESHOLD,
    },
  };
  const colourChange = `base-timer__path-remaining ${_setRemainingPathColor()}`;
  return (
    <div className="base-timer">
      <span id="base-timer-label" className="base-timer__label">
        {formatTime(timeLeft)}
      </span>
      <svg
        className="base-timer__svg"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g className="base-timer__circle">
          <circle
            className="base-timer__path-elapsed"
            cx="50"
            cy="50"
            r="45"
          ></circle>
          <path
            id="base-timer-path-remaining"
            strokeDasharray={_setCircleDasharray()}
            className={colourChange}
            d="
              M 50, 50
              m -45, 0
              a 45,45 0 1,0 90,0
              a 45,45 0 1,0 -90,0
            "
          ></path>
        </g>
      </svg>
    </div>
  );

  function formatTime(time) {
    if (time < 0 || completed) {
      time = duration;
      if (completedText) return completedText;
    }

    const hours = Math.floor(time / 60 / 60) % 60;
    const minutes = Math.floor(time / 60) % 60;
    let seconds = time % 60;

    return hours > 0
      ? `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${
          seconds < 10 ? "0" : ""
        }${seconds}`
      : minutes > 0
      ? `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
      : `${seconds}s`;
  }

  function _setRemainingPathColor() {
    const { alert, warning, info } = COLOR_CODES;
    if (timeLeft <= alert.threshold) {
      return alert.class;
    } else if (timeLeft <= warning.threshold) {
      return warning.class;
    }
    return info.class;
  }

  function calculateTimeFraction() {
    const rawTimeFraction = timeLeft / duration;
    return rawTimeFraction - (1 / duration) * (1 - rawTimeFraction);
  }

  function _setCircleDasharray() {
    return `${(calculateTimeFraction() * FULL_DASH_ARRAY).toFixed(0)} 283`;
  }
}
