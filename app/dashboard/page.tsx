"use client";

import ProtectedRoute from "@/app/components/auth/ProtectedRoute";
import { useAuth } from "@/app/context/AuthContext";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <div className="mt-4">
              <p className="text-gray-600">
                Welcome, <span className="font-medium">{user?.name}</span>!
              </p>
              <p className="text-gray-600 mt-2">
                You are logged in as: {user?.email}
              </p>

              {user?.isAdmin && (
                <div className="mt-4 p-3 bg-blue-50 rounded-md">
                  <p className="text-blue-700">You have admin privileges.</p>
                </div>
              )}

              <div className="mt-6">
                <button
                  onClick={logout}
                  className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
