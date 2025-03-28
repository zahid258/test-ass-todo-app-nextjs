import React from "react";
import TaskItem from "./TaskItem";
import { motion } from "framer-motion";
import { useTaskStore } from "@/store/taskStore";
import { IToDoResponse } from "@/models";

const TaskList: React.FC<{ tasks: Array<IToDoResponse> }> = ({
  tasks,
}: {
  tasks: Array<IToDoResponse>;
}) => {
  return (
    <motion.div
      layout
      className="mt-6 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
    >
      {tasks.length === 0 ? (
        <p className="text-gray-400">No tasks available</p>
      ) : (
        tasks.map((task) => <TaskItem key={task.id} task={task} />)
      )}
    </motion.div>
  );
};

export default TaskList;
