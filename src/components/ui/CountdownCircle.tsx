import React, { useEffect, useState, FC } from "react";

/*
 * TODO: 
 * - [ ] Pass down time remaining
 * - [ ] Fix placement
 * - [ ] Reverse animation
 */

interface CountdownProps {
  timeRemaining: number;
  timerState: 'pomodoro' | 'break' | 'longBreak';
  onTimeRemainingChange: (timeRemaining: number) => void;
  onTimerStateChange: (state: 'pomodoro' | 'break' | 'longBreak') => void;
}

// Define the Countdown component using TypeScript
const Countdown = ({ timeRemaining, timerState, onTimeRemainingChange, onTimerStateChange }: CountdownProps) => {
  // Constants for SVG dimensions
  const d = 15;
  const o = -0.5 * d;
  const sw = 0.1 * d;
  const r = 0.5 * (d - sw);

  // Timer duration in seconds (equivalent to $t in SCSS)
  const [pomodoroState, setPomodoroState] = useState<'pomodoro' | 'break' | 'longBreak'>('pomodoro');
  let duration;
  switch (pomodoroState) {
    case 'pomodoro':
      duration = 25 * 60;
      break;
    case 'break':
      duration = 5 * 60;
      break;
    case 'longBreak':
      duration = 15 * 60;
      break;
    default:
      duration = 0;
  }
  const [time, setTime] = useState<number>(duration);

  // Countdown effect to decrement time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => (prev > 0 ? prev - 1 : duration));
    }, 1000);

    return () => clearInterval(timer);
  }, [duration]);

  // Calculate stroke dash offset for SVG animation
  const dashOffset = 1 - time / duration;
  const stateColor = `hsl(${120 * dashOffset}, 50%, 50%)`;

  return (
    <div
      className="w-full relative"
      style={
        {
          "--t": time,
          "--s": time,
          width: `100%`,
          height: `100%`,
          animation: `t ${duration}s linear infinite`,
        } as React.CSSProperties
      }
    >
      <svg
        viewBox={`${o} ${o} ${d} ${d}`}
        style={{ width: `${100}%`, height: `${100}%`, strokeWidth: sw }}
      >
        {/* Background circle */}
        <circle r={r} fill="none" stroke="grey" />
        {/* Countdown circle */}
        <circle
          r={r}
          pathLength="1"
          fill="none"
          stroke={stateColor} // Adjust stroke color
          strokeDasharray={`${dashOffset} 1`}
          className="rotate-[-90deg]"
        />
      </svg>
      {/* Timer display */}
      <div
        style={{
          font: `${0.25 * d}em/2 "Ubuntu Mono", Consolas, Monaco, monospace`,
          position: "absolute",
          top: "28%",
          left: "21%",
        }}
      >
        {Math.floor(time / 60).toString().padStart(2, "0")}:{(time % 60).toString().padStart(2, "0")}
      </div>
    </div>
  );
};

export default Countdown;
