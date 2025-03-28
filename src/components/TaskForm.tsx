import { useState } from "react";
import { useTaskStore } from "@/store/taskStore";
import { TaskStatus } from "@/types/task";

const TaskForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const addTask = useTaskStore((state) => state.addTask);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    addTask({
      id: Date.now().toString(),
      title,
      description,
      assignedTo: "User1",
      status: "pending" as TaskStatus,
    });

    setTitle("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg">
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 w-full"
      />
      <textarea
        placeholder="Task description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 w-full mt-2"
      />
      <button type="submit" className="mt-2 p-2 bg-blue-500 text-white">
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;
