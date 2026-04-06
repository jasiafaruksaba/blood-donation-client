// import { createBrowserRouter } from "react-router";

import App from "../App";
import Home from "../pages/Home/Home";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

import DashboardLayout from "../pages/Dashboard/DashboardLayout";
import Profile from "../pages/Dashboard/Profile";

import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";

import AllUsers from "../pages/Dashboard/Admin/AllUsers";
import CreateRequest from "../pages/Dashboard/CreateRequest";
import MyRequests from "../pages/Dashboard/MyRequests";

import DonationRequests from "../pages/DonationRequests/DonationRequests";
import DonationDetails from "../pages/DonationDetails/DonationDetails";
import Search from "../pages/Search/Search";
import Funding from "../pages/Funding/Funding";
import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/search", element: <Search /> },
      { path: "/donation-requests", element: <DonationRequests /> },

      {
        path: "/donation/:id",
        element: (
          <PrivateRoute>
            <DonationDetails />
          </PrivateRoute>
        ),
      },

      {
        path: "/funding",
        element: (
          <PrivateRoute>
            <Funding />
          </PrivateRoute>
        ),
      },
    ],
  },

  // Dashboard routes
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { path: "profile", element: <Profile /> },

      // donor
      { path: "create-donation-request", element: <CreateRequest /> },
      { path: "my-donation-requests", element: <MyRequests /> },

      // admin
      {
        path: "all-users",
        element: (
          <AdminRoute>
            <AllUsers />
          </AdminRoute>
        ),
      },
    ],
  },
]);

export default router;