import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { XCircle } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  IDataSourceResponse,
  IToDoRequest,
  IToDoResponse,
  IUserResponse,
  TaskStatus,
  taskStatuses,
} from "@/models";
import { useAuthStore } from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";
import { editTodos } from "./apis";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { object } from "framer-motion/client";
interface TaskFormProps {
  onClose: Dispatch<SetStateAction<boolean>>;
  task: IToDoResponse
}

const EditTaskFormModal: React.FC<TaskFormProps> = ({ onClose, task }) => {
  console.log("task", task);
  const [title, setTitle] = useState(task?.todo);
  const { setAuth, token } = useAuthStore();
  const [description, setDescription] = useState(task?.details);
  const [assignee, setAssignee] = useState<string | null>(null);
  const [status, setStatus] = useState<TaskStatus>("PENDING");
  const [users, setUsers] = useState<Array<IUserResponse>>([]);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: {
      todo: string;
      details: string;
      userId: string | null;
      dueDate: Date;
      status: TaskStatus;
    }) => editTodos(token, payload), // Ensure this returns a promise
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      onClose(false);
    },
    onError: (error) => {
      console.error("Error submitting task:", error);
    },
  });

  useEffect(() => {
    // Fetch users from the API
    const fetchUsers = async () => {
      try {
        const response = await axios.post<IDataSourceResponse<IUserResponse>>(
          "http://localhost:3002/api/users/get-all",
          {
            pagedListRequest: {
              pageNo: 1,
              pageSize: 10000,
            },
            queryOptionsRequest: {
              filtersRequest: [
                {
                  field: "role",
                  value: "User",
                  matchMode: 1,
                  operator: 1,
                },
              ],
            },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUsers(response.data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const createTodosPayload = {
      todo: title,
      details: description,
      userId: assignee,
      dueDate: new Date().toISOString(), // Convert to ISO string
      status: status,
      id:task?.id
    };

    mutation.mutate(createTodosPayload as any);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div className="bg-gray-800 p-6 rounded-lg w-96">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Create Task</h2>
          <XCircle className="cursor-pointer" onClick={() => onClose(false)} />
        </div>
        <form onSubmit={handleSubmit} className="mt-4">
          <input
            type="text"
            placeholder="Task Title"
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Task Description"
            className="w-full p-2 mt-2 bg-gray-700 border border-gray-600 rounded text-white"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <select
            className="w-full p-2 mt-2 bg-gray-700 border border-gray-600 rounded text-white"
            value={assignee ?? undefined}
            onChange={(e) => setAssignee(e.target.value)}
          >
            <option value="" hidden>
              Select Assignee
            </option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {`${user.firstName} ${user.lastName}`}
              </option>
            ))}
          </select>
          <select
            className="w-full p-2 mt-2 bg-gray-700 border border-gray-600 rounded text-white"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
          >
            <option value="" hidden disabled>
              Select Status
            </option>
            {taskStatuses.map((x) => (
              <option value={x}>{x}</option>
            ))}
            {/* Add your status options here */}
          </select>
          <button
            className="mt-4 w-full bg-blue-500 py-2 rounded text-white hover:bg-blue-600"
            type="submit"
          >
            Add Task
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default EditTaskFormModal;
