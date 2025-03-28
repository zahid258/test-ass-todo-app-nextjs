import React, { useState, useEffect } from "react";
import { XCircle } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { IDataSourceResponse, IToDoRequest, IToDoResponse, IUserResponse, TaskStatus, taskStatuses } from "@/models";
import { useAuthStore } from "@/store/authStore";

interface TaskFormProps {
  onClose: () => void;
}

const TaskFormModal: React.FC<TaskFormProps> = ({ onClose }) => {
  const [title, setTitle] = useState("");
    const { setAuth,  token} = useAuthStore();
  
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState<string | null>(null);
  const [status, setStatus] = useState<TaskStatus>("PENDING");
  const [users, setUsers] = useState<Array<IUserResponse>>([]);

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
              'Authorization': `Bearer ${token}`
            }
          }
        );
        setUsers(response.data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title ) return;

    try {
      const response = await axios.post<IToDoResponse, IToDoRequest>(
        "http://localhost:3002/api/todos",
        {
          todo: title,
          details: description,
          userId: assignee,
          dueDate: new Date(),
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Handle the response as needed
    } catch (error) {
      console.error("Error submitting task:", error);
    }

    onClose();
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
          <XCircle className="cursor-pointer" onClick={onClose} />
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
            {taskStatuses.map(x =>  <option value={x}>{x}</option>)}
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

export default TaskFormModal;
