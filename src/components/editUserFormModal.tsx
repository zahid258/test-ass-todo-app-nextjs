import React, { useState, useEffect, SetStateAction, Dispatch } from "react";
import { Flag, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { IDataSourceResponse, IToDoRequest, IToDoResponse, IUserResponse, TaskStatus, taskStatuses } from "@/models";
import { useAuthStore } from "@/store/authStore";
import { useForm } from "react-hook-form";
import { IResponseBase } from "@/models/inerfaces/response/response-base";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editUser } from "./apis";

interface TaskFormProps {
  onClose: Dispatch<SetStateAction<boolean>>;
  user: IUserResponse
}

const EditUserFormModal: React.FC<TaskFormProps> = ({ onClose, user }) => {
  console.log("sadsad->", user);
  const [title, setTitle] = useState("");
  const { setAuth, token } = useAuthStore();
  const queryClient = useQueryClient();
  console.log('user=====>',user);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IUserResponse>({
    defaultValues: {
      userName: "",
      email: "",
      password: "",
      firstName: "",
      middleName: "",
      gender: undefined,
      lastName: "",
      dateOfBirth: new Date(),
      role: "User",
      phoneNum: 0,
      pictureUrl: "",
      id: user?.id,
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        userName: user.userName,
        email: user.email,
        password: user.password,
        firstName: user.firstName,
        middleName: user.middleName,
        gender: user.gender,
        lastName: user.lastName,
        dateOfBirth: user.dateOfBirth,
        role: user.role,
        phoneNum: user.phoneNum,
        pictureUrl: user.pictureUrl || "",
        id: user?.id,
        // password: user.password, // Don't pre-fill passwords for security reasons
      });
    }
  }, [user, reset]);

  const mutation = useMutation({
    mutationFn: (payload: IUserResponse) => editUser(token, payload), // Ensure this returns a promise
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onClose(false);
    },
    onError: (error) => {
      console.error("Error submitting task:", error);
    },
  });

  const onSubmit = (data: IUserResponse) => {
    data.role = "User";
    data.id =  user?.id,
    console.log("data: ",data)
    
    mutation.mutate(data);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div className="bg-gray-800 p-6 rounded-lg w-96">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">Create User</h2>
          <XCircle
            className="cursor-pointer text-white"
            onClick={() => onClose(false)}
          />
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
            {...register("email")}
          />
          {errors.email && (
            <span className="text-red-500">{errors.email.message}</span>
          )}

          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            {...register("password")}
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

export default EditUserFormModal;
