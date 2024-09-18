"use client";
import { useEffect, useState } from "react";
import * as deadlineFormatters from "~/util/deadlineFormatters";
import { api } from "~/trpc/react";

type Countdown = {
  date: Date;
  name: string;
};

export default function Home() {
  const pickUpPiaDate = new Date("2024-09-18 17:30:00");
  const thanksgivingDate = new Date("2024-11-25");

  const deadlines = api.deadline.getAll.useQuery();
  console.log(deadlines);

  const dates = [
    { date: pickUpPiaDate, name: "Pia Volleyball" },
    { date: thanksgivingDate, name: "Thanksgiving" },
  ]


  // countdown 
  const [countdowns, setCountdowns] = useState<Countdown[]>();
  const modes = ["default", "pomodoro", "week", "month"];
  const [modeIndex, setModeIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const countdowns = dates.map((date) => {
        const now = new Date();
        const distance = date.date.getTime() - now.getTime();
        return { date: new Date(distance), name: date.name };
      })
      setCountdowns(countdowns);
    }, 1); // update every second

    return () => clearInterval(interval);
  }, []);

  // Convert countdown from milliseconds to a human-readable format
  const formatCountdown = (milliseconds: number) => {
    switch (modes[modeIndex]) {
      case "pomodoro":
        return deadlineFormatters.pomodoroFormatter(milliseconds);
      case "week":
        return deadlineFormatters.weekFormatter(milliseconds);
      case "month":
        return deadlineFormatters.monthFormatter(milliseconds);
      default:
        return deadlineFormatters.formatDeadline(milliseconds);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <div className="flex flex-col gap-4 sm:grid-cols-2 md:gap-8 w-full">
          {countdowns?.map((countdown, index) => (
            <div
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
              key={index + countdown.name}
              onClick={() => setModeIndex((modeIndex + 1) % modes.length)}
            >
              <h3 className="text-2xl font-bold">{countdown.name}</h3>
              <div className="text-lg">
                {formatCountdown(countdown.date.getTime())}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
