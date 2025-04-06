import React from "react";
import "./App.css";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import SurvDashboard from "./pages/SurvDashboard";
import SurvLogin from "./pages/SurvLogin";
import AdminLayout from "./layouts/AdminLayout";
import ExamenAdd from "./pages/ExamenAdd";
import Assignation from "./pages/Assignation";
import Surv from "./pages/Surv";

import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Navigate,
} from "react-router-dom";

// Route privée pour administrateur : redirige vers /loginadmin si pas de token
const AdminPrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("jwtToken");
  return isAuthenticated ? children : <Navigate to="/loginadmin" replace />;
};

// Route privée pour surveillant : redirige vers /loginsurv si pas de token
const SurvPrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("jwtToken");
  return isAuthenticated ? children : <Navigate to="/loginsurv" replace />;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Pages de login */}
      <Route path="/loginadmin" element={<AdminLogin />} />
      <Route path="/loginsurv" element={<SurvLogin />} />

      {/* Routes protégées pour administrateur */}
      <Route
        path="/admin"
        element={
          <AdminPrivateRoute>
            <AdminLayout />
          </AdminPrivateRoute>
        }
      >
        <Route index path="dashboard" element={<AdminDashboard />} />
        <Route path="examens" element={<ExamenAdd />} />
        <Route path="surveillants" element={<Assignation />} />
        <Route path="Assignation" element={<Assignation />} />
        <Route path="Notif" element={<Assignation />} />
        <Route path="profile" element={<Assignation />} />
      </Route>

      {/* Route protégée pour surveillant */}
      <Route
        path="/surv"
        element={
          <SurvPrivateRoute>
            <Surv />
          </SurvPrivateRoute>
        }
      />

    </>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
