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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 z-50"
    >
      <div className="bg-white  w-full max-w-md p-6 rounded-2xl shadow-xl transition-all duration-300">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-black">Update Task</h2>
          <XCircle
            className="w-6 h-6 text-gray-500 hover:text-red-500 cursor-pointer transition"
            onClick={() => onClose(false)}
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Task Title */}
          <input
            type="text"
            placeholder="Task Title"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white placeholder-gray-500 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Task Description */}
          <textarea
            placeholder="Task Description"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white placeholder-gray-500 text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Assignee */}
          <select
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
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

          {/* Status */}
          <select
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
          >
            <option value="" hidden disabled>
              Select Status
            </option>
            {taskStatuses.map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition duration-200"
          >
           Save
          </button>
        </form>
      </div>
         
    </motion.div>
  );
};

export default EditTaskFormModal;
