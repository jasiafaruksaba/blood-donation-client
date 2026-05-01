
import { createBrowserRouter } from "react-router"; 

import App from "../App";
import Home from "../pages/Home/Home";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

import DashboardLayout from "../pages/Dashboard/DashboardLayout";
import Profile from "../pages/Dashboard/Profile";
import DashboardHome from "../pages/Dashboard/DashboardHome";
import CreateRequest from "../pages/Dashboard/Donor/CreateRequest";
import MyRequests from "../pages/Dashboard/Donor/MyRequests";

// Admin Components
import AllUsers from "../pages/Dashboard/Admin/AllUsers";
import AllRequests from "../pages/Dashboard/Admin/AllRequests";

// Public Pages
import DonationRequests from "../pages/DonationRequests/DonationRequests";
import DonationDetails from "../pages/DonationDetails/DonationDetails";
import Search from "../pages/Search/Search";
import Funding from "../pages/Funding/Funding";

// Guards
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },

      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },

      { path: "search", element: <Search /> },
      { path: "donation-requests", element: <DonationRequests /> },
      { path: "funding", element: <Funding /> },

      {
        path: "donation-requests/:id",
        element: <DonationDetails />,
      },
    ],
  },

  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      // ✅ IMPORTANT: index = /dashboard
      { index: true, element: <DashboardHome /> },

      // ✅ OPTIONAL: now /dashboard/home will also work
      { path: "home", element: <DashboardHome /> },

      { path: "profile", element: <Profile /> },

      { path: "create-donation-request", element: <CreateRequest /> },
      { path: "my-donation-requests", element: <MyRequests /> },

      {
        path: "all-blood-donation-request",
        element: (
          <PrivateRoute>
            <AllRequests />
          </PrivateRoute>
        ),
      },
      {
        path: "all-users",
        element: (
          <AdminRoute>
            <AllUsers />
          </AdminRoute>
        ),
      },

      { path: "funding", element: <Funding /> },

      {
        path: "donation/:id",
        element: (
          <PrivateRoute>
            <DonationDetails />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default router;