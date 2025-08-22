import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { totp } from "@/lib/api";
import { TotpSetup } from "./TotpSetup";

interface TotpManagerProps {
  className?: string;
}

export const TotpManager = ({ className = "" }: TotpManagerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [totpStatus, setTotpStatus] = useState<{
    enabled: boolean;
    verified: boolean;
  } | null>(null);
  const [showSetup, setShowSetup] = useState(false);
  const [showDisableForm, setShowDisableForm] = useState(false);
  const [disableCode, setDisableCode] = useState("");
  const [isDisabling, setIsDisabling] = useState(false);

  useEffect(() => {
    checkTotpStatus();
  }, []);

  const checkTotpStatus = async () => {
    setIsLoading(true);
    try {
      const response = await totp.status();
      setTotpStatus(response.data);
    } catch (error: any) {
      console.error("Failed to check TOTP status:", error);
      toast.error("Failed to load security settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetupComplete = () => {
    setShowSetup(false);
    checkTotpStatus();
    toast.success("Two-factor authentication has been enabled!");
  };

  const handleSetupCancel = () => {
    setShowSetup(false);
  };

  const handleDisableSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDisabling(true);

    try {
      const success = await totp.disable(disableCode);
      if (success) {
        toast.success("Two-factor authentication has been disabled");
        setShowDisableForm(false);
        setDisableCode("");
        checkTotpStatus();
      } else {
        toast.error("Invalid authentication code");
      }
    } catch (error: any) {
      const errorMessage =
          error.response?.data?.message || "Failed to disable 2FA";
      toast.error(errorMessage);
    } finally {
      setIsDisabling(false);
    }
  };

  const cancelDisable = () => {
    setShowDisableForm(false);
    setDisableCode("");
  };

  if (isLoading) {
    return (
        <div
            className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}
        >
          <div className="flex items-center space-x-3">
            <svg
                className="animate-spin h-5 w-5 text-blue-600"
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
              />
              <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading security settings...</span>
          </div>
        </div>
    );
  }

  if (showSetup) {
    return (
        <div className={className}>
          <TotpSetup
              onComplete={handleSetupComplete}
              onCancel={handleSetupCancel}
          />
        </div>
    );
  }

  return (
      <div
          className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}
      >
        <div className="bg-blue-600 px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm">
              <svg
                  className="w-5 h-5 text-white"
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
            <div>
              <h2 className="text-lg font-semibold text-white">
                Two-Factor Authentication
              </h2>
              <p className="text-sm text-blue-100">
                Add an extra layer of security to your account
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {totpStatus?.enabled ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <svg
                      className="w-6 h-6 text-green-600 dark:text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                  >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m5.982-4.963A8.985 8.985 0 0120 12a8.966 8.966 0 01-1.732 5.267m-2.476 2.476A8.966 8.966 0 0112 20c-2.493 0-4.786-.984-6.433-2.583M3.733 6.767A8.985 8.985 0 004 12c0 1.856.562 3.585 1.533 5.017"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                      Two-factor authentication is enabled
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-300">
                      Your account is protected with an additional security layer
                    </p>
                  </div>
                </div>

                {!showDisableForm ? (
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          You'll need your authenticator app to sign in
                        </p>
                      </div>
                      <Button
                          variant="outline"
                          onClick={() => setShowDisableForm(true)}
                          className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
                      >
                        Disable 2FA
                      </Button>
                    </div>
                ) : (
                    <div className="space-y-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
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
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 19c-.77.833.192 2.5 1.732 2.5z"
                          />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-red-800 dark:text-red-200">
                            Disable Two-Factor Authentication
                          </p>
                          <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                            This will make your account less secure. Enter your
                            current authentication code to confirm.
                          </p>
                        </div>
                      </div>

                      <form onSubmit={handleDisableSubmit} className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Authentication Code
                          </label>
                          <Input
                              type="text"
                              value={disableCode}
                              onChange={(e) =>
                                  setDisableCode(
                                      e.target.value.replace(/\D/g, "").slice(0, 6)
                                  )
                              }
                              placeholder="000000"
                              maxLength={6}
                              className="text-center text-lg tracking-widest font-mono"
                              autoFocus
                              required
                          />
                        </div>

                        <div className="flex space-x-3">
                          <Button
                              type="button"
                              variant="outline"
                              onClick={cancelDisable}
                              className="flex-1"
                              disabled={isDisabling}
                          >
                            Cancel
                          </Button>
                          <Button
                              type="submit"
                              variant="destructive"
                              className="flex-1"
                              disabled={isDisabling || disableCode.length !== 6}
                          >
                            {isDisabling ? (
                                <div className="flex items-center justify-center gap-2">
                                  <svg
                                      className="animate-spin h-4 w-4 text-white"
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
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                  </svg>
                                  <span>Disabling...</span>
                                </div>
                            ) : (
                                "Disable 2FA"
                            )}
                          </Button>
                        </div>
                      </form>
                    </div>
                )}
              </div>
          ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <svg
                      className="w-6 h-6 text-yellow-600 dark:text-yellow-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                  >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 19c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Two-factor authentication is disabled
                    </p>
                    <p className="text-sm text-yellow-600 dark:text-yellow-300">
                      Your account could be more secure with 2FA enabled
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Why enable two-factor authentication?
                    </h3>
                    <ul className="mt-2 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li className="flex items-center space-x-2">
                        <svg
                            className="w-4 h-4 text-green-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                          <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                          />
                        </svg>
                        <span>Protects against password theft</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <svg
                            className="w-4 h-4 text-green-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                          <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                          />
                        </svg>
                        <span>Prevents unauthorized access</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <svg
                            className="w-4 h-4 text-green-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                          <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                          />
                        </svg>
                        <span>
                      Adds security even if your password is compromised
                    </span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <svg
                            className="w-4 h-4 text-green-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                          <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                          />
                        </svg>
                        <span>Works with popular authenticator apps</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <svg
                          className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5"
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
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                          Compatible Authenticator Apps
                        </p>
                        <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                          Google Authenticator, Microsoft Authenticator, Authy,
                          1Password, and other TOTP-compatible apps
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button onClick={() => setShowSetup(true)} className="w-full">
                    <svg
                        className="w-4 h-4 mr-2"
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
                    Enable Two-Factor Authentication
                  </Button>
                </div>
              </div>
          )}
        </div>
      </div>
  );
};
