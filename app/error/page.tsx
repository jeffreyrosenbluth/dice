"use client";

import React from "react";
import { useRouter } from "next/navigation";

const ErrorPage: React.FC = () => {
  const router = useRouter();

  const handleRetry = () => {
    router.push("/login");
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 mt-32">
      <div className="bg-slate-800 shadow-md rounded-lg p-8 max-w-md text-center">
        <h1 className="text-2xl font-semibold text-red-600 mb-4">
          Oops! Something went wrong.
        </h1>
        <p className="text-white mb-6">
          Either the email was not found or the password is incorrect. Please
          try again.
        </p>

        <button
          onClick={handleRetry}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-opacity-50"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
