"use client";
import { useEffect, useState } from "react";

type Countdown = {
  date: Date;
  name: string;
};

export default function Home() {
  const pickUpPiaDate = new Date("2024-09-16 17:30:00");
  const thanksgivingDate = new Date("2024-11-25");

  const dates = [
    { date: pickUpPiaDate, name: "Pia Volleyball" },
    { date: thanksgivingDate, name: "Thanksgiving" },
  ]


  // countdown 
  const [countdowns, setCountdowns] = useState<Countdown[]>();

  useEffect(() => {
    const interval = setInterval(() => {
      const countdowns = dates.map((date) => {
        const now = new Date();
        const distance = date.date.getTime() - now.getTime();
        return { date: new Date(distance), name: date.name };
      })
      setCountdowns(countdowns);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Convert countdown from milliseconds to a human-readable format
  const formatCountdown = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const seconds = totalSeconds % 60;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const minutes = totalMinutes % 60;
    const totalHours = Math.floor(totalMinutes / 60);
    const hours = totalHours % 24;
    const days = Math.floor(totalHours / 24);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <div className="flex flex-col gap-4 sm:grid-cols-2 md:gap-8">
          {countdowns?.map((countdown, index) => (
            <div
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
              key={index + countdown.name}
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
