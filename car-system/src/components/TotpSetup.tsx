import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { totp } from "@/lib/api";

interface TotpSetupProps {
  email: string;
  secret: string;
  qrCodeDataUri: string;
  onComplete: () => void;
}

export const TotpSetup = ({
                            email,
                            secret,
                            qrCodeDataUri,
                            onComplete,
                          }: TotpSetupProps) => {
  const [totpCode, setTotpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const isValid = await totp.verify(email, totpCode);
      if (isValid) {
        toast.success("TOTP setup completed successfully");
        onComplete();
      } else {
        toast.error("Invalid TOTP code");
      }
    } catch (error: any) {
      toast.error(
          error.response?.data?.message || "Failed to verify TOTP code"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-blue-600 px-6 py-8 text-center">
              <h1 className="text-2xl font-bold text-white mb-1">
                Set Up Two-Factor Authentication
              </h1>
              <p className="text-blue-100">
                Scan the QR code with your authenticator app
              </p>
            </div>
            <div className="m-5">
              <img src={qrCodeDataUri} alt="TOTP QR Code" className="mx-auto" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                Or enter this code manually: <code>{secret}</code>
              </p>
              <form className="space-y-4 mt-4" onSubmit={handleVerify}>
                <div>
                  <label
                      htmlFor="totpCode"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Verification Code
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
                <Button
                    type="submit"
                    className="w-full"
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
                      "Verify & Continue"
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
  );
};
