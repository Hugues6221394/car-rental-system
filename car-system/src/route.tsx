import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from "@tanstack/react-router";
import Home from "./pages/home";
import { SignInPage } from "./pages/auth/sign-in";
import { SignUpPage } from "./pages/auth/sign-up";
import Dashboard from "./pages/dashboard";
import { ProtectedLayout } from "./pages/protectedLayout";
import { PublicLayout } from "./pages/publicLayout";
import CarCreatePage from "./pages/admin/car-create";
import AdminPage from "./pages/admin";
import CarDetailsPage from "./pages/car/[id]";
import ReservationPage from "./pages/admin/reservation";
import User from "./pages/admin/User";
import CarsPage from "./pages/car/car";
import { ResetPassword } from "./components/ResetPassword";
import Contact from "./pages/car/Contact";
import ProfilePage from "./pages/Profile";
import NotificationsPage from './pages/Notifications';

// Create a root error boundary component
function RootErrorBoundary({ error }: { error: Error }) {
  return (
      <div className="error-container">
        <h1>Oops! Something went wrong</h1>
        <pre>{error.message}</pre>
      </div>
  );
}

const rootRoute = createRootRoute({
  component: () => <Outlet />,
  errorComponent: RootErrorBoundary,
});

// Public layout route
const publicLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "public",
  component: PublicLayout,
});

// Home page as child of public layout
const indexRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/",
  component: Home,
});

// Sign-in page as child of public layout
const signInRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/sign-in",
  component: SignInPage,
});

// Sign-up page as child of public layout
const signUpRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/sign-up",
  component: SignUpPage,
});

const resetPasswordRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/reset-password",
  component: ResetPassword,
});

// Contact page as child of public layout
const contactRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/contact",
  component: Contact,
});

// Protected layout route
const protectedLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "protected",
  component: () => (
      <ProtectedLayout>
        <Outlet />
      </ProtectedLayout>
  ),
});

// Dashboard route as a child of protected layout
const dashboardRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: "/dashboard",
  component: Dashboard,
});

// Car page route as a child of protected layout
const carRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: "/cars",
  component: CarsPage,
});

const carDetailsRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: "/cars/$carId",
  component: CarDetailsPage,
});

const adminRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: "/admin",
  component: AdminPage,
});

const usersRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: "/users",
  component: User,
});

const reservationsRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: "/reservations",
  component: ReservationPage,
});

// Admin car creation route as a child of protected layout
const carCreateRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: "/car-create",
  component: CarCreatePage,
});

// Profile route - COMMENTED OUT TEMPORARILY
const profileRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: "/profile",
  component: ProfilePage,
});

const notificationsRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: "/notifications",
  component: NotificationsPage,
});


// Group routes under their respective layouts
const routeTree = rootRoute.addChildren([
  publicLayoutRoute.addChildren([
    indexRoute,
    signInRoute,
    signUpRoute,
    resetPasswordRoute,
    contactRoute,
  ]),
  protectedLayoutRoute.addChildren([
    dashboardRoute,
    carRoute,
    carDetailsRoute,
    adminRoute,
    carCreateRoute,
    reservationsRoute,
    usersRoute,
    profileRoute, // COMMENTED OUT TEMPORARILY
    notificationsRoute,
  ]),
]);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}