"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-2xl text-center space-y-8">

        <h1 className="text-4xl font-bold text-gray-800">
          Task Management System
        </h1>

      
        <p className="text-gray-600 text-lg">
          A secure full-stack task manager built with Next.js, Node.js,
          Prisma, and JWT authentication.  
          Manage your tasks efficiently with authentication,
          search, filters, and pagination.
        </p>

        
        <div className="flex justify-center gap-6">

          <button
            onClick={() => router.push("/login")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium">
            Login
          </button>

          <button
            onClick={() => router.push("/register")}
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-medium">
            Register
          </button>

        </div>

      </div>
    </div>
  );
}