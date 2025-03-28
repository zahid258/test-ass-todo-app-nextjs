import React, { useEffect, useState } from "react";
import TaskList from "@/components/TaskList";
import TaskFormModal from "@/components/TaskFormModal";
import WithAuth from "./WithAuth";
import { useAuthStore } from "@/store/authStore";
import { IDataSourceResponse, IToDoResponse } from "@/models";
import axios from "axios";
import {useMutation} from '@tanstack/react-query'

const AdminDashboard = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { user, token } = useAuthStore();
  const [todos, setTodos] = useState<Array<IToDoResponse>>([]);
  useEffect(() => {
    const getTodosForUser = async () => {
      let result = await axios.post<IDataSourceResponse<IToDoResponse>>(
        "http://localhost:3002/api/todos/get-all",
        {
          pagedListRequest: {
            pageNo: 1,
            pageSize: 10000,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTodos(result.data.data);
    };
    getTodosForUser();
  }, []);
  return (
    <div className="h-screen p-6 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <button
        onClick={() => setModalOpen(true)}
        className="bg-blue-500 px-4 py-2 rounded mt-4"
      >
        + Add Task
      </button>
      <TaskList tasks={todos} />
      {modalOpen && <TaskFormModal onClose={() => setModalOpen(false)} />}
    </div>
  );
};

export default WithAuth(AdminDashboard, "Admin");
