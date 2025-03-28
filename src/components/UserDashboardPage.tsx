import React, { useEffect, useState } from "react";
import TaskList from "@/components/TaskList";
import WithAuth from "./WithAuth";
import { useAuthStore } from "@/store/authStore";
import { IDataSourceResponse, IToDoResponse } from "@/models";
import axios from "axios";

const UserDashboard = () => {
  const {user, token} = useAuthStore()
  const [todos, setTodos] = useState<Array<IToDoResponse>>([]);
  useEffect(()=>{
    const getTodosForUser= async () =>{
      let result = await axios.post<IDataSourceResponse<IToDoResponse>>(
        "http://localhost:3002/api/todos/get-all",
        {
          pagedListRequest: {
            pageNo: 1,
            pageSize: 10000,
          },
          queryOptionsRequest: {
            filtersRequest: [
              {
                field: "userId",
                value: user?.id,
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
      setTodos(result.data.data)

    }
    getTodosForUser();
  }, [])
  return (
    <div className="h-screen p-6 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold">User Dashboard</h1>
      <TaskList tasks={todos} />
    </div>
  );
};

export default WithAuth(UserDashboard, "User");
