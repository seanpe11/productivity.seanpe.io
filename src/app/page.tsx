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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

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

  // MODALS
  const DeleteModal = () => {
    return (
      <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-4 flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Are you sure?</h2>
          <p className="text-lg">This action cannot be undone.</p>
          <div className="flex gap-4 justify-end">
            <button className="bg-blue text-white px-4 py-2 rounded-xl">Yes</button>
            <button className="bg-white text-blue px-4 py-2 rounded-xl">No</button>
          </div>
        </div>
      </div>
    )
  }

  const AddModal = () => {
    return (
      <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-4 flex flex-col gap-4 text-black">
          <h2 className="text-2xl font-bold">Are you sure?</h2>
          <p className="text-lg">This action cannot be undone.</p>
          <div className="flex gap-4 justify-end">
            <button className="bg-blue text-black px-4 py-2 rounded-xl" onClick={() => { console.log("click") }}>Yes</button>
            <button className="bg-white text-blaack px-4 py-2 rounded-xl" onClick={() => { setShowAddModal(false); console.log(showAddModal) }}>No</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <div>
          Deadlines
        </div>
        <div className="flex gap-4 justify-end">
          <button className="bg-white/5 text-white px-4 py-2 rounded-xl" onClick={() => { setShowAddModal(true) }}>Add Deadline</button>
        </div>
        {isLoading ? <PuffLoader color="white" loading={isLoading} /> :
          <div className="flex flex-col w-max rounded-xl bg-blue/10">
            {countdowns.length > 0 &&
              countdowns.map((countdown, index) => (
                <div
                  className={`flex flex-col gap-4 p-4 hover:bg-white/20 ${(index < countdowns.length - 1) ? "border-b" : ""}`}
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
        {showDeleteModal && <DeleteModal />}
        {showAddModal && <AddModal />}
      </div>
    </main>
  );
}
