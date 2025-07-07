import React, { useState, useEffect, useRef } from "react";
import bellSound from "../../assets/bell.mp3";

interface TimerProps {
  initialSeconds?: number;
  onComplete?: () => void;
}

const NEGATIVE_LIMIT = -15;

const Timer: React.FC<TimerProps> = ({
  initialSeconds = 60 * 7, // Default to 7 minutes
  onComplete,
}) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  // Calculate elapsed and remaining time
  const elapsed = initialSeconds - seconds;
  const remaining = seconds;

  // Set background color: green if 1 minute elapsed and 1+ minute remains
  let backgroundColor = undefined;
  if (elapsed >= 60 && remaining > 60) {
    backgroundColor = "green";
  }

  if (remaining <= 0) {
    backgroundColor = "red"; // Red when time is up
  }
  // Import the bell sound at the top of the file
  // import bellSound from "../../assets/bell.mp3";
  if (elapsed == 60) {
    const bell = new Audio(bellSound);
    bell.play();
  }

  if (remaining == 60) {
    const bell = new Audio(bellSound);
    bell.play();
  }

  if (remaining == 0) {
    const bell = new Audio(bellSound);
    bell.play();
    setTimeout(() => {
      const bell2 = new Audio(bellSound);
      bell2.play();
    }, 500); // Play second bell after 0.5 second
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
    }, 500); // Play second bell after 0.5 second
  }

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
        Start
      </button>
      <button onClick={pause} disabled={!isActive}>
        Pause
      </button>
      <button onClick={reset}>Reset</button>
    </div>
  );
};

export default Timer;
