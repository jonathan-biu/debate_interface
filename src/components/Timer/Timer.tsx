import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import bellSound from "../../assets/bell.mp3";
import { t } from "i18next";

interface TimerProps {
  initialSeconds?: number;
  onComplete?: () => void;
}

const NEGATIVE_LIMIT = -15;

const Timer: React.FC<TimerProps> = ({
  initialSeconds = 60 * 7,
  onComplete,
}) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);
  const [silenceBell, setSilenceBell] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (isActive && seconds > NEGATIVE_LIMIT) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === NEGATIVE_LIMIT) {
      setIsActive(false);
      if (onComplete) onComplete();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, seconds, onComplete]);

  // Reset timer when URL changes
  useEffect(() => {
    setIsActive(false);
    setSeconds(initialSeconds);
  }, [location.pathname, initialSeconds]);

  const start = () => setIsActive(true);
  const pause = () => setIsActive(false);
  const reset = () => {
    setIsActive(false);
    setSeconds(initialSeconds);
  };

  const formatTime = (secs: number) => {
    const absSecs = Math.abs(secs);
    const m = Math.floor(absSecs / 60)
      .toString()
      .padStart(2, "0");
    const s = (absSecs % 60).toString().padStart(2, "0");
    return `${secs < 0 ? "-" : ""}${m}:${s}`;
  };

  const elapsed = initialSeconds - seconds;
  const remaining = seconds;

  let backgroundColor = undefined;
  if (elapsed >= 60 && remaining > 60) {
    backgroundColor = "green";
  }
  if (remaining <= 0) {
    backgroundColor = "red";
  }

  // Bell logic moved into useEffect to avoid playing on every render
  useEffect(() => {
    if (silenceBell) return;

    if (elapsed === 60) {
      const bell = new Audio(bellSound);
      bell.play();
    }
    if (remaining === 60) {
      const bell = new Audio(bellSound);
      bell.play();
    }
    if (remaining === 0) {
      const bell = new Audio(bellSound);
      bell.play();
      setTimeout(() => {
        const bell2 = new Audio(bellSound);
        bell2.play();
      }, 500);
    }
    if (seconds === NEGATIVE_LIMIT) {
      const bell = new Audio(bellSound);
      bell.play();
      setTimeout(() => {
        const bell2 = new Audio(bellSound);
        bell2.play();
        setTimeout(() => {
          const bell3 = new Audio(bellSound);
          bell3.play();
        }, 500);
      }, 500);
    }
    // eslint-disable-next-line
  }, [elapsed, remaining, seconds, silenceBell]);

  return (
    <div>
      <div
        style={{
          fontSize: "2rem",
          marginBottom: "1rem",
          backgroundColor,
          color: backgroundColor ? "white" : undefined,
          padding: "0.5rem",
          borderRadius: "0.5rem",
          transition: "background-color 0.3s",
        }}
      >
        {formatTime(seconds)}
      </div>
      <button onClick={start} disabled={isActive || seconds === NEGATIVE_LIMIT}>
        {t("Timer.start")}
      </button>
      <button onClick={pause} disabled={!isActive}>
        {t("Timer.pause")}
      </button>
      <button onClick={reset}>{t("Timer.reset")}</button>
      <button
        style={{ marginLeft: "1rem" }}
        onClick={() => setSilenceBell((prev) => !prev)}
        aria-pressed={silenceBell}
        title={silenceBell ? t("Timer.unmute_bell") : t("Timer.silence_bell")}
      >
        <i className={`fa-solid fa-bell${silenceBell ? "-slash" : ""}`}></i>
      </button>
    </div>
  );
};

export default Timer;
