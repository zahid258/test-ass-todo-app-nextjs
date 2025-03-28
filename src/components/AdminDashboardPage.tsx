import React, { useState } from "react";
import TaskList from "@/components/TaskList";
import TaskFormModal from "@/components/TaskFormModal";
import WithAuth from "./WithAuth";
import { useAuthStore } from "@/store/authStore";
import { IDataSourceResponse, IToDoResponse, IUserResponse } from "@/models";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "./Sidebar";
import UserList from "./UserList";
import UserFormModal from "./UserFormModal";
import { fetchUsers, fetchTodos } from "./apis";



const AdminDashboard = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const { token } = useAuthStore();

  // Fetch todos
  const {
    data: todos = [],
    isLoading: todosLoading,
    isError: todosError,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: () => fetchTodos(token),
  });
console.log("todos", todos);
  // Fetch users
  const {
    data: userLists = [],
    isLoading: usersLoading,
    isError: usersError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(token),
  });
  return (
    <div className="h-screen bg-gray-900 text-white flex">
      {/* Sidebar on the left */}
      <div className="w-64">
        <Sidebar setIsCheck={setIsCheck} isCheck={isCheck} />
      </div>

      {/* Main content area */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold">
          {isCheck ? "User Dashboard" : "Admin Dashboard"}
        </h1>

        <button
          onClick={() =>
            isCheck ? setUserModalOpen(true) : setModalOpen(true)
          }
          className="bg-blue-500 px-4 py-2 rounded mt-4"
        >
          {isCheck ? "+ Add User" : "+ Add Task"}
        </button>

        {/* Loading states */}
        {todosLoading || usersLoading ? (
          <p className="mt-4">Loading...</p>
        ) : todosError || usersError ? (
          <p className="mt-4 text-red-500">Failed to load data</p>
        ) : isCheck ? (
          <UserList usersList={userLists} />
        ) : (
          <TaskList tasks={todos} />
        )}

        {/* Modals */}
        {modalOpen && <TaskFormModal onClose={() => setModalOpen(false)} />}
        {userModalOpen && (
          <UserFormModal onClose={() => setUserModalOpen(false)} />
        )}
      </div>
    </div>
  );
};

export default WithAuth(AdminDashboard, "Admin");
