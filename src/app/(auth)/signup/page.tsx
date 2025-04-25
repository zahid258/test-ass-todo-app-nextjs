"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const router = useRouter();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("role", role);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-3xl p-10 shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all duration-300 animate-fade-in"
      >
        <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
          Create Account
        </h2>

        <form onSubmit={handleSignup} className="space-y-6">
          {/* Email Input */}
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
              required
            />
          </div>

          {/* Password Input */}
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
              required
            />
          </div>

          {/* Role Selector */}
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Role
            </label>
            <select
              id="role"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-8 w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 active:scale-[0.98] transition-transform duration-200"
          >
            Sign Up
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-gray-500">
          Already have an account?{" "}
          <a href="/" className="text-blue-400 hover:underline transition">
            Login
          </a>
        </p>
      </motion.div>
          
    </div>
  );
};

export default Signup;
