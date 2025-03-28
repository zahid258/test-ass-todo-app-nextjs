import React, { useState } from "react";
import TaskItem from "./TaskItem";
import { motion } from "framer-motion";
import { useTaskStore } from "@/store/taskStore";
import { IToDoResponse, IUserResponse } from "@/models";
import UserItem from "./UserItem";
import EditUserFormModal from "./editUserFormModal";
const UserList: React.FC<{ usersList: Array<IUserResponse> }> = ({
  usersList,
}: {
  usersList: Array<IUserResponse>;
}) => {
  return (
    <motion.div
      layout
      className="mt-6 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
    >
      {usersList.length === 0 ? (
        <p className="text-gray-400">No Users available</p>
      ) : (
        usersList.map((user) => <UserItem key={user.id} singleUser={user} />)
      )}
    </motion.div>
  );
};

export default UserList;
