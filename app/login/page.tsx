"use client";
import React, { useState } from "react";
import { login, signup, logout, signInWithGoogle } from "./actions";
import { useAuth } from "@/app/authctx";

const handleGoogleSignin = async () => {
  try {
    const result = await signInWithGoogle();
    console.log("Sign-in result:", result);
    if (result.success && result.url) {
      console.log("Redirecting to:", result.url);
      window.location.href = result.url;
    } else {
      console.error("Sign-in failed:", result.error || "Unknown error");
    }
  } catch (err) {
    console.error("Error during sign-in:", err);
  }
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { user } = useAuth();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <form className="w-full max-w-md p-8 border-small border-slate-500 rounded-lg">
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
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Sign up
          </button>
        </div>
      </form>

      {user && (
        <form action={logout} className="mt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Log Out
          </button>
        </form>
      )}
      <div>
        <button onClick={handleGoogleSignin}>Sign in with Google</button>
      </div>
    </div>
  );
}
