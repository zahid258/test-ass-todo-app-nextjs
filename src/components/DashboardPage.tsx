"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AdminDashboard from "./AdminDashboardPage";
import UserDashboard from "./UserDashboardPage";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const { token, user,role } = useAuthStore();
  
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      router.push("/");
    } else {
      setLoading(false);
    }
  }, [token, router]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-900 text-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
        <p className="mt-4 text-lg text-gray-300 animate-pulse">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  return role === "Admin" ? <AdminDashboard /> : <UserDashboard />;
};

export default Dashboard;
