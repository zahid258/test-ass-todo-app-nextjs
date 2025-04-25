import { FC, useState } from "react";
import { useTaskStore } from "@/store/taskStore";
import { useRouter } from "next/navigation";


type Props = {
  isCheck: boolean
  setIsCheck: (isCheck: boolean) => void;
};



const Sidebar: FC<Props> = (props) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-800 px-4 py-6">
      <div className="mb-8">
        {/* You can add a logo or heading here if needed */}
      </div>
      <div className="flex flex-col space-y-4">
        <div
          className={
            (!props.isCheck
              ? "bg-blue-500 text-white "
              : "bg-white text-gray-800 hover:bg-blue-50 ") +
            "px-6 py-3 rounded-lg shadow transition-colors cursor-pointer"
          }
          onClick={() => props.setIsCheck(false)}
        >
          Admin
        </div>
        <div
          className={
            (props.isCheck
              ? "bg-blue-500 text-white "
              : "bg-white text-gray-800 hover:bg-blue-50 ") +
            "px-6 py-3 rounded-lg shadow transition-colors cursor-pointer"
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
