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



    if (response.status) {
      setAuth(response.data.token, response.data.role, response.data);
      router.push("/dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 px-4 py-8">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white rounded-3xl p-10 shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all duration-300 animate-fade-in"
      >
        <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
          Sign In
        </h2>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-8 w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 active:scale-[0.98] transition-transform duration-200"
        >
          Log In
        </button>
      </form>
      {/* Optional animation style */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
          
    </div>
  );
};

export default Login;
