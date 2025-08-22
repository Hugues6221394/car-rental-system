import { useAuth } from "@/components/AuthContext";
import { AuthForm } from "@/components/AuthForm";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const SignInPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/dashboard" });
    }
  }, [isAuthenticated, navigate]);
  return (
      <AuthForm
          type="sign-in"
          title="Welcome Back"
          subtitle="Please sign in to continue"
      />
  );
};
