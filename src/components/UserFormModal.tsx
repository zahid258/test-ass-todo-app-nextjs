import React, { useState, useEffect } from "react";
import { XCircle } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { IDataSourceResponse, IToDoRequest, IToDoResponse, IUserResponse, TaskStatus, taskStatuses } from "@/models";
import { useAuthStore } from "@/store/authStore";
import { useForm } from "react-hook-form";
import { IResponseBase } from "@/models/inerfaces/response/response-base";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "./apis";

interface TaskFormProps {
  onClose: () => void;
}

const UserFormModal: React.FC<TaskFormProps> = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const { setAuth, token } = useAuthStore();
  const queryClient = useQueryClient();
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState<string | null>(null);
  const [status, setStatus] = useState<TaskStatus>("PENDING");
  const [users, setUsers] = useState<Array<IUserResponse>>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IUserResponse>();

    const mutation = useMutation({
      mutationFn: (payload: IUserResponse) => createUser(token, payload), // Ensure this returns a promise
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["users"] });
        onClose();
      },
      onError: (error) => {
        console.error("Error submitting task:", error);
      },
    });

  const onSubmit = (data: IUserResponse) => {
      data.role = "User";
      data.status = Number(data.status)
      mutation.mutate(data)

  };

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

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!title ) return;

  //   try {
  //     const response = await axios.post<IToDoResponse, IToDoRequest>(
  //       "http://localhost:3002/api/todos",
  //       {
  //         todo: title,
  //         details: description,
  //         userId: assignee,
  //         dueDate: new Date(),
  //         status: status,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     // Handle the response as needed
  //   } catch (error) {
  //     console.error("Error submitting task:", error);
  //   }

  //   onClose();
  // };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div className="bg-gray-800 p-6 rounded-lg w-96">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">Create User</h2>
          <XCircle className="cursor-pointer text-white" onClick={onClose} />
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-2 pt-4"
        >
          <input
            type="text"
            placeholder="First Name"
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            {...register("firstName", { required: "First Name is required" })}
          />
          {errors.firstName && (
            <span className="text-red-500">{errors.firstName.message}</span>
          )}

          <input
            type="text"
            placeholder="Middle Name"
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            {...register("middleName")}
          />

          <input
            type="text"
            placeholder="Last Name"
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            {...register("lastName", { required: "Last Name is required" })}
          />
          {errors.lastName && (
            <span className="text-red-500">{errors.lastName.message}</span>
          )}

          <input
            type="text"
            placeholder="User Name"
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            {...register("userName", { required: "User Name is required" })}
          />
          {errors.userName && (
            <span className="text-red-500">{errors.userName.message}</span>
          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            {...register("email", {
              required: "Email is required",
              pattern: /^\S+@\S+$/i,
            })}
          />
          {errors.email && (
            <span className="text-red-500">{errors.email.message}</span>
          )}

          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
            })}
          />
          {errors.password && (
            <span className="text-red-500">{errors.password.message}</span>
          )}

          <select
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            {...register("gender", { required: "Gender is required" })}
          >
            <option value="" hidden>
              Select Gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && (
            <span className="text-red-500">{errors.gender.message}</span>
          )}

          <input
            type="date"
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            {...register("dateOfBirth", {
              required: "Date of Birth is required",
            })}
          />
          {errors.dateOfBirth && (
            <span className="text-red-500">{errors.dateOfBirth.message}</span>
          )}

          <input
            type="number"
            placeholder="Phone Number"
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            {...register("phoneNum", {
              required: "Phone Number is required",
              minLength: {
                value: 10,
                message: "Phone Number must be at least 10 digits",
              },
            })}
          />
          {errors.phoneNum && (
            <span className="text-red-500">{errors.phoneNum.message}</span>
          )}
          <select
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            {...register("status", { required: "Status is required" })}
          >
            <option value="" hidden>
              Select Status
            </option>
            <option value="1">Active</option>
            <option value="0">In Active</option>
          </select>
          {errors.status && (
            <span className="text-red-500">{errors.status.message}</span>
          )}

          <button
            className="mt-4 w-full bg-blue-500 py-2 rounded text-white hover:bg-blue-600"
            type="submit"
          >
            Add User
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default UserFormModal;
