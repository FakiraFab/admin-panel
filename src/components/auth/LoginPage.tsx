import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { useAuthStore } from "../../store/authStore";

export const LoginPage: React.FC = () => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { isAuthenticated, login } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/products" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const success = await login(password);
      if (!success) {
        setError("Invalid password. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f7] flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <img
              className="w-16 h-20 mx-auto mb-4 object-cover"
              alt="Logo"
              src="/img-3207-1.png"
            />
            <h1 className="text-2xl font-bold text-[#1c1c1c] mb-2">
              Admin Login
            </h1>
            <p className="text-[#979797] text-sm">
              Enter your password to access the admin dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 px-4 rounded-xl border border-[#dadada]"
                required
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full h-12 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-[#979797]">
            Demo password: admin123
          </div>
        </CardContent>
      </Card>
    </div>
  );
};