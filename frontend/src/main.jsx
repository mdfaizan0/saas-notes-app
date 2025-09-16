import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// Lazy load pages
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const CreateTenant = lazy(() => import("./pages/CreateTenant"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Pricing = lazy(() => import("./pages/Pricing"));

// Routes
const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/create-tenant", element: <CreateTenant /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/about", element: <About /> },
      { path: "/contact", element: <Contact /> },
      { path: "/pricing", element: <Pricing /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Suspense fallback={<div>Loading...</div>}>
    <RouterProvider router={appRouter} />
  </Suspense>
);
