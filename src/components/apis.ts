import { IDataSourceResponse, IUserResponse, IToDoResponse } from "@/models";
import axios from "axios";

export const fetchUsers = async (token: string | null) => {
  const { data } = await axios.post<IDataSourceResponse<IUserResponse>>(
    "http://localhost:3002/api/users/get-all",
    {
      pagedListRequest: {
        pageNo: 1,
        pageSize: 10000,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`, // Ensure token is properly managed
      },
    }
  );
  return data.data;
};

export const fetchTodos = async (token: string | null) => {
  const { data } = await axios.post<IDataSourceResponse<IToDoResponse>>(
    "http://localhost:3002/api/todos/get-all",
    {
      pagedListRequest: {
        pageNo: 1,
        pageSize: 10000,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`, // Ensure token is properly managed
      },
    }
  );
  return data.data;
};

export const createTodos = async (token: string | null, payload: object) => {
  const { data } = await axios.post(
    "http://localhost:3002/api/todos",
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data.data;
}

export const editTodos = async (token: string | null, payload: object) => {
  const { data } = await axios.put(`http://localhost:3002/api/todos/${payload?.id}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data.data;
};
export const deleteTodos = async (token: string | null, payload: object) => {
  const { data } = await axios.delete(
    `http://localhost:3002/api/todos/${payload?.id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data.data;
};
export const deleteUser = async (token: string | null, payload: object) => {
  const { data } = await axios.delete(
    `http://localhost:3002/api/users/${payload?.id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data.data;
};
export const createUser = async (token: string | null, payload: object) => {
  const { data } = await axios.post(
    "http://localhost:3002/api/users",
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data.data;
};

export const editUser = async (token: string | null, payload: object) => {
  console.log("payload :",payload)
  const { data } = await axios.put(
    `http://localhost:3002/api/users/${payload?.id}`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data.data;
};