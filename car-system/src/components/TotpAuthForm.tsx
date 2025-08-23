import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { auth } from "@/lib/api";
import { useAuth } from "@/components/AuthContext";

interface TotpAuthFormProps {
  email: string;
  password: string;
  onBack: () => void;
}

export const TotpAuthForm = ({
                               email,
                               password,
                               onBack,
                             }: TotpAuthFormProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [totpCode, setTotpCode] = useState("");
  const { setAuthenticated, verifyAuth } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await auth.signInWithTotp({
        email,
        password,
        totpCode,
      });

      // Update auth state
      setAuthenticated(true);
      await verifyAuth();

      toast.success("Signed in successfully");
      navigate({ to: "/dashboard" });
    } catch (error: any) {
      const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Invalid authentication code";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-red-600 px-6 py-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm mb-4">
                <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                  <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m0 0v2m0-2h2m-2 0H10m9-12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white mb-1">
                Two-Factor Authentication
              </h1>
              <p className="text-red-100">
                Enter your 6-digit authentication code
              </p>
            </div>

            <div className="m-5">
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-start space-x-3">
                  <svg
                      className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                  >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">
                      Authentication Required
                    </p>
                    <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                      Open your authenticator app and enter the 6-digit code for{" "}
                      <span className="font-medium">{email}</span>
                    </p>
                  </div>
                </div>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label
                      htmlFor="totpCode"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Authentication Code
                  </label>
                  <Input
                      id="totpCode"
                      name="totpCode"
                      type="text"
                      required
                      maxLength={6}
                      pattern="[0-9]{6}"
                      placeholder="000000"
                      value={totpCode}
                      onChange={(e) =>
                          setTotpCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      className="text-center text-2xl tracking-widest font-mono"
                      autoComplete="one-time-code"
                      autoFocus
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Enter the 6-digit code from your authenticator app
                  </p>
                </div>

                <div className="flex space-x-3">
                  <Button
                      type="button"
                      variant="outline"
                      onClick={onBack}
                      className="flex-1"
                      disabled={isLoading}
                  >
                    Back
                  </Button>
                  <Button
                      type="submit"
                      className="flex-1 bg-red-600 hover:bg-red-700"
                      disabled={isLoading || totpCode.length !== 6}
                  >
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
                          <span>Verifying...</span>
                        </div>
                    ) : (
                        "Verify & Sign In"
                    )}
                  </Button>
                </div>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Having trouble?{" "}
                  <button
                      type="button"
                      className="text-red-600 dark:text-red-400 hover:underline"
                      onClick={() => {
                        toast.info(
                            "Contact support if you can't access your authenticator app"
                        );
                      }}
                  >
                    Contact support
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};