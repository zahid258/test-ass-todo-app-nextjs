import React, { useState } from "react";

import { motion } from "framer-motion";
import { CheckCircle, Circle } from "lucide-react";
import { IToDoRequest, IToDoResponse, TaskStatus, taskStatuses } from "@/models";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const TaskItem: React.FC<{ task: IToDoResponse }> = ({ task }) => {
  const [completed, setCompleted] = useState(task.status === "COMPLETED");
  const {user, token} = useAuthStore()

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`p-4 rounded-lg border flex items-center justify-between transition ${
        completed
          ? "border-green-500 bg-green-900/20"
          : "border-gray-700 bg-gray-800"
      }`}
    >
      <div>
        <h3 className="text-lg font-bold">{task.todo}</h3>
        <p className="text-sm text-gray-400">
          Assigned to:{" "}
          {task?.user
            ? `${task?.user.firstName} ${task.user.lastName}`
            : "Unassigned"}
        </p>
      </div>
      <div className=""> 
        <select
          className="w-full p-2 mt-2 bg-gray-700 border border-gray-600 rounded text-white"
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
            <option value={x}>{x}</option>
          ))}
          {/* Add your status options here */}
        </select>
        <select
          className="w-full p-2 mt-2 bg-gray-700 border border-gray-600 rounded text-white"
          value={task.status}
          key={task.id}
          onChange={async (e) => {
            await axios.put<any, IToDoResponse, IToDoRequest>(
              "http://localhost:3002/api/todos/" + task.id,
              {
                ...task,
                userId: e.target.value as TaskStatus,
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
            <option value={x}>{x}</option>
          ))}
          {/* Add your status options here */}
        </select>
      </div>
    </motion.div>
  );
};

export default TaskItem;
