"use client";
import CountdownCircle from "~/components/ui/CountdownCircle";

export default function CountdownPage() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <CountdownCircle timeRemaining={25 * 60} timerState="pomodoro" />
      </main>
    </>
  );
}
