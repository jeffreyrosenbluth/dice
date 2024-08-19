"use client";
import React, { useState } from "react";
import { login, signup } from "./actions";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev); // Toggle the password visibility state
  };

  return (
    <div className="flex items-start justify-center min-h-screen ">
      <form className="mt-20 p-8 border-small border-slate-500">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Experiments for Learning Finance
        </h2>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-300"
          >
            Email:
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-300"
          >
            Password:
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-200"
            >
              {showPassword ? "Hide" : "Show"}{" "}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <button
            formAction={login}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Log in
          </button>
          <button
            formAction={signup}
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Sign up
          </button>
        </div>

        {/* <div className="text-right mb-4">
          <a href="#" className="text-blue-400 hover:underline">
            Forgot password?
          </a>
        </div> */}
      </form>
    </div>
  );
}
