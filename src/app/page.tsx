"use client";
import { useState } from "react";
import { api } from "~/trpc/react";
import { PuffLoader } from "react-spinners";
import CountdownList from "~/components/CountdownList";
import DateTimePicker from "~/components/DateTimePicker";

type Countdown = {
  date: Date;
  name: string;
};

export default function Home() {
  const { data: deadlines } = api.deadline.getAll.useQuery();
  const [showAddModal, setShowAddModal] = useState(false);

  const AddModal = () => {
    const [deadlineName, setDeadlineName] = useState('');
    const [deadlineDate, setDeadlineDate] = useState<Date>(new Date());

    const handleSave = () => {
      if (!deadlineName || !deadlineDate) {
        alert("Please fill out both fields");
        return;
      }
      console.log(deadlineName, deadlineDate);
      setShowAddModal(false);
    };

    return (
      <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-4 flex flex-col gap-4 text-black">
          <input type="text" placeholder="Deadline Name" onChange={(e) => setDeadlineName(e.target.value)} />
          <DateTimePicker selectedDate={deadlineDate} onDateChange={setDeadlineDate} />
          <div className="flex gap-4 justify-end">
            <button className="bg-white px-4 py-2 rounded-xl" onClick={handleSave}>Save</button>
            <button className="bg-white px-4 py-2 rounded-xl" onClick={() => { setShowAddModal(false) }}>Cancel</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <div>Deadlines</div>
        <div className="flex gap-4 justify-end">
          <button className="bg-white/5 text-white px-4 py-2 rounded-xl" onClick={() => { setShowAddModal(true); }}>Add Deadline</button>
        </div>
        {deadlines === undefined ? <PuffLoader color="white" loading={true} /> : null}
        <CountdownList deadlines={
          deadlines?.map(({ deadline, name }) => ({ date: new Date(deadline), name }))
        } /> {/* Pass deadlines directly */}
      </div>
      {showAddModal && <AddModal />}
    </main>
  );
}
