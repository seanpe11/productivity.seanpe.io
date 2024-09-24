"use client";
import { useState } from "react";
import { api } from "~/trpc/react";
import { PuffLoader } from "react-spinners";
import CountdownList from "~/components/CountdownList";
import DateTimePicker from "~/components/DateTimePicker";
import { useQueryClient } from "@tanstack/react-query";

export default function Home() {
  const queryClient = useQueryClient();
  const [isMutationLoading, setIsMutationLoading] = useState(false);
  const { data: deadlines } = api.deadline.getAll.useQuery();
  const { mutate: createDeadline } = api.deadline.create.useMutation({
    onMutate: () => { setIsMutationLoading(true); setShowAddModal(false); },
    onSuccess: () => {
      queryClient.invalidateQueries();
      setIsMutationLoading(false);
    }
  });
  const { mutate: deleteDeadline } = api.deadline.delete.useMutation({
    onMutate: () => { setIsMutationLoading(true); setShowDeleteModal(false); },
    onSuccess: () => {
      queryClient.invalidateQueries();
      setIsMutationLoading(false);
    }
  });

  const handleCreate = (name: string, deadline: Date) => {
    createDeadline({ name, deadline });
  };

  const handleDelete = (name: string, deadline: Date) => {
    setShowDeleteModal(true);
    setDeadlineName(name);
    setDeadlineDate(deadline);
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deadlineName, setDeadlineName] = useState('');
  const [deadlineDate, setDeadlineDate] = useState<Date>(new Date());

  const AddModal = () => {
    const [deadlineName, setDeadlineName] = useState('');
    const [deadlineDate, setDeadlineDate] = useState<Date>(new Date());

    const handleSave = () => {
      if (!deadlineName || !deadlineDate) {
        alert("Please fill out both fields");
        return;
      }
      handleCreate(deadlineName, deadlineDate);
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

  const DeleteModal = () => {
    return (
      <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-4 flex flex-col gap-4 text-black">
          <div className="flex gap-4 justify-end">
            Are you sure you want to delete this deadline?
            <button className="bg-white px-4 py-2 rounded-xl" onClick={() => { setShowDeleteModal(false) }}>Cancel</button>
            <button className="bg-white px-4 py-2 rounded-xl" onClick={() => { deleteDeadline({ name: deadlineName, deadline: deadlineDate }) }}>Delete</button>
          </div>
        </div>
      </div>
    )
  }

  const MutationLoader = () => {
    return (
      <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 flex items-center justify-center z-50">
        <div className="rounded-xl p-4 flex flex-col gap-4 text-black">
          <PuffLoader color="white" loading={true} />
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
        <CountdownList deadlines={deadlines}
          onDelete={handleDelete}
        />
        {}
      </div>
      {showAddModal && <AddModal />}
      {showDeleteModal && <DeleteModal />}
      {isMutationLoading && <MutationLoader />}
    </main>
  );
}
