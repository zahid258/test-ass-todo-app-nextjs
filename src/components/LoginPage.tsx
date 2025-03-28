"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import fetcher from "@/utils/axiosFetcher";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Replace with actual API call
    const response = await axios.post("http://localhost:3002/api/auth/login", {
      email,
      password,
    });

console.log("🚀 ~ handleLogin ~ response.data:", response.data)

    if (response.status) {
      setAuth(response.data.token, response.data.role, response.data);
      router.push("/dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-900 text-white">
      <form onSubmit={handleLogin} className="p-6 bg-gray-800 rounded-lg">
        <h2 className="text-2xl font-bold">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mt-2 bg-gray-700 border border-gray-600 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mt-2 bg-gray-700 border border-gray-600 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="mt-4 w-full bg-blue-500 py-2 rounded hover:bg-blue-600">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
