import React, { Dispatch, SetStateAction, useState } from "react";

import { motion } from "framer-motion";
import { CheckCircle, Circle } from "lucide-react";
import {
  IToDoRequest,
  IToDoResponse,
  IUserResponse,
  TaskStatus,
  taskStatuses,
} from "@/models";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import EditUserFormModal from "./editUserFormModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "./apis";
const UserItem: React.FC<{ singleUser: IUserResponse }> = ({ singleUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [completed, setCompleted] = useState(singleUser.status === 0);
  const { user, token } = useAuthStore();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (payload: {
      todo: string;
      details: string;
      userId: string | null;
      dueDate: Date;
      status: TaskStatus;
    }) => deleteUser(token, payload), // Ensure this returns a promise
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error("Error submitting task:", error);
    },
  });
  const handleDelete = (id: any) => {
    const createTodosPayload = {
      id: id,
    };

    mutation.mutate(createTodosPayload as any);
  };
  return (
    <>
      {isOpen && <EditUserFormModal onClose={setIsOpen} user={singleUser} />}

      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className={`p-6 rounded-2xl border shadow-sm transition-all duration-200 flex items-center justify-between gap-4 ${
          completed
            ? "border-green-400 bg-green-50 text-green-900"
            : "border-gray-300 bg-white text-gray-800"
        }`}
      >
        <div>
          <h3 className="text-lg font-semibold">{singleUser.userName}</h3>
          <p className="text-sm text-gray-500 mt-1">
            Assigned to:{" "}
            {singleUser
              ? `${singleUser?.firstName} ${singleUser.lastName}`
              : "Unassigned"}
          </p>
        </div>

        <div className="flex gap-3 items-center">
          {/* Edit Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 rounded-full hover:bg-blue-100 transition"
            title="Edit"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-blue-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
              />
            </svg>
          </button>

          {/* Delete Button */}
          <button
            onClick={() => handleDelete(singleUser?.id)}
            className="p-2 rounded-full hover:bg-red-100 transition"
            title="Delete"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-red-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default UserItem;
