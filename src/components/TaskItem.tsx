import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Circle } from "lucide-react";
import { IToDoRequest, IToDoResponse, TaskStatus, taskStatuses } from "@/models";
import axios from "axios";
import {deleteTodos} from './apis';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import EditTaskFormModal from '../components/editTaskForm';
import { useAuthStore } from "@/store/authStore";


const TaskItem: React.FC<{ task: IToDoResponse }> = ({ task }) => {
  const [completed, setCompleted] = useState(task.status === "COMPLETED");
  const [isOpen, setIsOpen] = useState(false);
  const {user, token} = useAuthStore();
    const queryClient = useQueryClient();  
    const mutation = useMutation({
      mutationFn: (payload: {
        todo: string;
        details: string;
        userId: string | null;
        dueDate: Date;
        status: TaskStatus;
      }) => deleteTodos(token, payload), // Ensure this returns a promise
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["todos"] });
      },
      onError: (error) => {
        console.error("Error submitting task:", error);
      },
    });
  const handleDelete = (id:any)=>{
    const createTodosPayload = {
      id:id
    };

    mutation.mutate(createTodosPayload as any);
  }
  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`p-6 rounded-3xl border shadow-[0_10px_30px_rgba(0,0,0,0.05)] bg-white transition-all duration-300 flex items-center justify-between ${
          completed ? "border-green-400" : "border-gray-200"
        }`}
      >
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{task.todo}</h3>
          <p className="text-sm text-gray-500 mt-1">
            Assigned to:{" "}
            {task?.user
              ? `${task?.user.firstName} ${task.user.lastName}`
              : "Unassigned"}
          </p>
        </div>

        <div className="w-1/2 ml-4">
          <div className="flex gap-2 justify-end mb-2">
            <div
              onClick={() => setIsOpen(true)}
              className="text-blue-600 p-2 rounded-full hover:bg-blue-100 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 cursor-pointer"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                />
              </svg>
            </div>
            <div
              onClick={() => handleDelete(task?.id)}
              className="text-red-600 p-2 rounded-full hover:bg-blue-100 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 cursor-pointer"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </div>
          </div>

          <select
            className="w-full p-3 mt-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={task.status}
            key={task.id}
            onChange={async (e) => {
              await axios.put<any, IToDoResponse, IToDoRequest>(
                "http://localhost:3002/api/todos/" + task.id,
                {
                  ...task,
                  status: e.target.value as TaskStatus,
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
            }}
          >
            <option value="" hidden disabled>
              Select Status
            </option>
            {taskStatuses.map((x) => (
              <option value={x} key={x}>
                {x}
              </option>
            ))}
          </select>

          <select
            className="w-full p-3 mt-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={task.userId}
            key={task.id + "-user"}
            onChange={async (e) => {
              await axios.put<any, IToDoResponse, IToDoRequest>(
                "http://localhost:3002/api/todos/" + task.id,
                {
                  ...task,
                  userId: e.target.value,
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
            }}
          >
            <option value="" hidden disabled>
              Assign User
            </option>
            {/* Replace taskStatuses with actual user list if available */}
            {taskStatuses.map((x) => (
              <option value={x} key={x + "-user"}>
                {x}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {isOpen && <EditTaskFormModal onClose={setIsOpen} task={task} />}
    </>
  );
};

export default TaskItem;
