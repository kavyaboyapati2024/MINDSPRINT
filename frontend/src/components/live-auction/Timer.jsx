// src/components/live-auction/Timer.jsx
import React, { useEffect, useState } from "react";

const Timer = ({ initialMinutes = 5, onTimeUp }) => {
  const [time, setTime] = useState(initialMinutes * 60);

  useEffect(() => {
    if (time <= 0) {
      if (onTimeUp) onTimeUp();
      return;
    }
    const interval = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [time, onTimeUp]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="text-lg font-bold text-red-600">
      ⏳ {formatTime(time)}
    </div>
  );
};

export default Timer;
