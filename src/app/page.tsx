"use client";
import { useEffect, useState } from "react";
import * as deadlineFormatters from "~/util/deadlineFormatters";
import { api } from "~/trpc/react";
import { PuffLoader } from "react-spinners";

type Countdown = {
  date: Date;
  name: string;
};

export default function Home() {
  const { data: deadlines, isLoading } = api.deadline.getAll.useQuery();

  // Countdown state
  const [countdowns, setCountdowns] = useState<Countdown[]>([]);
  const modes = ["default", "pomodoro", "week", "month"];
  const [modeIndex, setModeIndex] = useState(0);

  useEffect(() => {
    if (!deadlines) return; // Ensure deadlines are loaded before setting the interval THIS WAS IMPORTANT

    const interval = setInterval(() => {
      const now = new Date();
      const updatedCountdowns = deadlines.map(({ deadline, name }) => {
        const distance = new Date(deadline).getTime() - now.getTime();
        return { date: new Date(distance), name };
      });
      setCountdowns(updatedCountdowns);
    }, 1); // Update every second

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [deadlines]); // Depend on deadlines, so it runs when deadlines are available


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
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        {isLoading ? <PuffLoader color="white" loading={isLoading} /> :
          <div className="flex flex-col gap-4 sm:grid-cols-2 md:gap-8 w-full">
            {countdowns.length > 0 &&
              countdowns.map((countdown, index) => (
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
        }
      </div>
    </main>
  );
}
