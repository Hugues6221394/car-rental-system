import { RouterProvider } from "@tanstack/react-router";
import { AuthProvider } from "./components/AuthContext";
import { Toaster } from "./components/ui/sonner";
import { NotificationProvider } from '@/components/NotificationContext';
import { router } from "./route";

function App() {
  return (
      <AuthProvider>
        <NotificationProvider>
          <RouterProvider router={router} />
          <Toaster />
        </NotificationProvider>
      </AuthProvider>
  );
}

export default App;
