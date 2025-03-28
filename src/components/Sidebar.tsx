import { FC, useState } from "react";
import { useTaskStore } from "@/store/taskStore";
import { useRouter } from "next/navigation";


type Props = {
  isCheck: boolean
  setIsCheck: (isCheck: boolean) => void;
};



const Sidebar: FC<Props> = (props) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-800 text-white px-2">
      <div className="p-10"></div>
      <div className="flex flex-col">
        <div
          className={
            (!props.isCheck ? "bg-red-900 " : "bg-gray-900 ") +
            " px-6 py-3 text-white cursor-pointer"
          }
          onClick={() => props.setIsCheck(false)}
        >
          Admin
        </div>
        <div
          className={
            (props.isCheck ? "bg-red-900 " : "bg-gray-900 ") +
            " px-6 py-3 text-white bg-gray-900 cursor-pointer"
          }
          onClick={() => props.setIsCheck(true)}
        >
          User
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
