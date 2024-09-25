"use client";
import PomodoroTimer from "~/components/PomodoroTimer";
import { useState } from "react";

export default function PomodoroPage() {
  const [pomodoroState, setPomodoroState] = useState<'pomodoro' | 'break' | 'longBreak'>('pomodoro');

  const handlePomodoroStateChange = (state: 'pomodoro' | 'break' | 'longBreak') => {
    setPomodoroState(state);
  };

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <PomodoroTimer pomodoroState={pomodoroState} onPomodoroStateChange={handlePomodoroStateChange} />
      </main>
    </>
  );
}
