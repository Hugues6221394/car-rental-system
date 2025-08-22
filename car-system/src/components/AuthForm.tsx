import { useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { auth, totp } from "@/lib/api";
import { useAuth } from "@/components/AuthContext";
import { TotpAuthForm } from "./TotpAuthForm";
import { TotpSetup } from "./TotpSetup";

interface AuthProps {
  type: "sign-in" | "sign-up";
  title: string;
  subtitle?: string;
}

export const AuthForm = ({ type, title, subtitle }: AuthProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showTotpForm, setShowTotpForm] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [pendingCredentials, setPendingCredentials] = useState<{
    email: string;
    password: string;
  } | null>(null);
  const [totpSetup, setTotpSetup] = useState<{
    email: string;
    secret: string;
    qrCodeDataUri: string;
  } | null>(null);

  const isSignin = type === "sign-in";
  const { verifyAuth, setAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      if (isSignin) {
        console.log("Attempting sign-in with:", { email, password });
        const result = await auth.signIn({ email, password });
        console.log("Sign-in result:", result);

        if (result.requiresTotp) {
          console.log(
              "Requires TOTP:",
              result.requiresTotp,
              "Setup Required:",
              result.totpSetupRequired
          );
          if (result.totpSetupRequired) {
            const setupResult = await totp.setup(email);
            setTotpSetup({
              email,
              secret: setupResult.secret,
              qrCodeDataUri: setupResult.qrCodeDataUri,
            });
            toast.info("Please set up two-factor authentication");
          } else {
            setPendingCredentials({ email, password });
            setShowTotpForm(true);
            toast.info("Please enter your authentication code");
          }
        } else {
          console.log("Normal login completed");
          setAuthenticated(true);
          await verifyAuth();
          toast.success("Signed in successfully");
          navigate({ to: "/dashboard" });
        }
      } else {
        const firstName = formData.get("firstname") as string;
        const lastName = formData.get("lastname") as string;

        const signUpResult = await auth.signUp({
          email,
          password,
          firstName,
          lastName,
          role: "USER",
        });

        setTotpSetup({
          email,
          secret: signUpResult.totpSetup.secret,
          qrCodeDataUri: signUpResult.totpSetup.qrCodeDataUri,
        });
        toast.info("Please set up two-factor authentication");
      }
    } catch (error: any) {
      const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          (isSignin ? "Invalid email or password" : "Failed to create account");
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    try {
      await auth.forgotPassword(email);
      toast.success("Password reset email sent. Please check your inbox.");
      setShowForgotPassword(false);
    } catch (error: any) {
      const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to send password reset email";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTotpBack = () => {
    setShowTotpForm(false);
    setPendingCredentials(null);
  };

  if (totpSetup) {
    return (
        <TotpSetup
            email={totpSetup.email}
            secret={totpSetup.secret}
            qrCodeDataUri={totpSetup.qrCodeDataUri}
            onComplete={() => {
              setTotpSetup(null);
              navigate({ to: "/sign-in" });
            }}
        />
    );
  }

  if (showTotpForm && pendingCredentials) {
    return (
        <TotpAuthForm
            email={pendingCredentials.email}
            password={pendingCredentials.password}
            onBack={handleTotpBack}
        />
    );
  }

  if (showForgotPassword) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <div className="max-w-md w-full">
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-blue-600 px-6 py-8 text-center">
                <h1 className="text-2xl font-bold text-white mb-1">
                  Reset Password
                </h1>
                <p className="text-blue-100">
                  Enter your email to receive a password reset link
                </p>
              </div>
              <div className="m-5">
                <form className="space-y-4" onSubmit={handleForgotPassword}>
                  <Input
                      label="Email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      autoFocus
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
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
                          <span>Sending...</span>
                        </div>
                    ) : (
                        "Send Reset Link"
                    )}
                  </Button>
                </form>
                <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => setShowForgotPassword(false)}
                >
                  Back to Sign In
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
            <div className="bg-blue-600 px-6 py-8 text-center">
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
                      d="M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm-5 14h4m-4-3h4m-4-3h4M9 9h1.5m-1.5 3h1.5m-1.5 3h1.5M6 9h.5m-.5 3h.5m-.5 3h.5"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white mb-1">{title}</h1>
              {subtitle && <p className="text-blue-100">{subtitle}</p>}
            </div>

            <div className="m-5">
              <form className="space-y-4" onSubmit={handleSubmit}>
                {!isSignin && (
                    <>
                      <Input
                          label="Firstname"
                          name="firstname"
                          type="text"
                          required
                      />
                      <Input
                          label="Lastname"
                          name="lastname"
                          type="text"
                          required
                      />
                    </>
                )}

                <Input
                    label="Email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    autoFocus
                />
                <Input
                    label="Password"
                    name="password"
                    type="password"
                    required
                    autoComplete={isSignin ? "current-password" : "new-password"}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
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
                        <span>{isSignin ? "Signing in..." : "Signing up..."}</span>
                      </div>
                  ) : isSignin ? (
                      "Sign In"
                  ) : (
                      "Sign Up"
                  )}
                </Button>
              </form>

              {isSignin && (
                  <div className="mt-4 text-center">
                    <button
                        type="button"
                        className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                        onClick={() => setShowForgotPassword(true)}
                    >
                      Forgot Password?
                    </button>
                  </div>
              )}
            </div>

            <div className="px-6 pb-6 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                <span className="px-2 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800">
                  {isSignin
                      ? "Don't have an account?"
                      : "Already have an account?"}
                </span>
                </div>
              </div>
              <Link
                  to={isSignin ? "/sign-up" : "/sign-in"}
                  className={cn(
                      "mt-4 inline-flex w-full justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors",
                      "border border-gray-300 dark:border-gray-600",
                      "text-gray-900 dark:text-gray-100",
                      "hover:bg-gray-100 dark:hover:bg-gray-700"
                  )}
              >
                {isSignin ? "Create an account" : "Sign In"}
              </Link>
            </div>
          </div>
        </div>
      </div>
  );
};
