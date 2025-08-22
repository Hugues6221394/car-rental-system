import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { getAuthToken, getUser, auth } from "@/lib/api";

interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: { id: number; email: string; role: string } | null;
  verifyAuth: () => Promise<boolean>;
  signOut: () => Promise<void>;
  setAuthenticated: (status: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Changed from named export to const + export
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUserState] = useState<{
    id: number;
    email: string;
    role: string;
  } | null>(null);

  const verifyAuth = useCallback(async () => {
    try {
      const token = getAuthToken();
      const userData = getUser();
      const authStatus = !!token && !!userData;
      setIsAuthenticated(authStatus);
      setUserState(userData);
      return authStatus;
    } catch (error) {
      console.error("Auth verification error:", error);
      setIsAuthenticated(false);
      setUserState(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await auth.signOut();
      setIsAuthenticated(false);
      setUserState(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }, []);

  useEffect(() => {
    verifyAuth();
  }, [verifyAuth]); // Added verifyAuth to dependencies

  return (
      <AuthContext.Provider
          value={{
            isLoading,
            isAuthenticated,
            user,
            verifyAuth,
            signOut,
            setAuthenticated: setIsAuthenticated,
          }}
      >
        {children}
      </AuthContext.Provider>
  );
};

// Keep this as named export
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Add a default export for better HMR compatibility
export default AuthProvider;