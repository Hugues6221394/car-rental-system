import { useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { auth } from "@/lib/api";

interface ResetPasswordSearch {
  token?: string;
}

export const ResetPassword = () => {
  const navigate = useNavigate();

  const { token } = useSearch({ strict: false }) as ResetPasswordSearch;
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (!token) {
      toast.error("Invalid or missing reset token");
      setIsLoading(false);
      return;
    }

    try {
      await auth.resetPassword(token, newPassword);
      toast.success("Password reset successfully. Please sign in.");
      navigate({ to: "/sign-in" });
    } catch (error: any) {
      const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to reset password";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle case where token is missing
  if (!token) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <div className="max-w-md w-full">
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-red-600 px-6 py-8 text-center">
                <h1 className="text-2xl font-bold text-white mb-1">
                  Invalid Reset Link
                </h1>
                <p className="text-red-100">
                  The password reset link is invalid or missing.
                </p>
              </div>
              <div className="m-5">
                <Button
                    className="w-full bg-red-600 hover:bg-red-700"
                    onClick={() => navigate({ to: "/sign-in" })}
                >
                  Return to Sign In
                </Button>
              </div>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-red-600 px-6 py-8 text-center">
              <h1 className="text-2xl font-bold text-white mb-1">
                Reset Password
              </h1>
              <p className="text-red-100">Enter your new password</p>
            </div>
            <div className="m-5">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <Input
                    label="New Password"
                    name="newPassword"
                    type="password"
                    required
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <Input
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    required
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isLoading}>
                  {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                          <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                          ></circle>
                          <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>Resetting...</span>
                      </div>
                  ) : (
                      "Reset Password"
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
  );
};