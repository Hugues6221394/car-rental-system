import { AuthForm } from "@/components/AuthForm";
import { useAuth } from "@/components/AuthContext";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const SignUpPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/dashboard" });
    }
  }, [isAuthenticated, navigate]);

  return (
    <AuthForm
      type="sign-up"
      title="Create Account"
      subtitle="Get started with our service"
    />
  );
};
