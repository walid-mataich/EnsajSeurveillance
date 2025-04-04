import React from "react";
import "./App.css";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import Home from "./pages/Home";
import SurvDashboard from "./pages/SurvDashboard";
import SurvLogin from "./pages/SurvLogin";
import Sidebar from "./components/Sidebar";
import AdminLayout from "./layouts/AdminLayout";
import ExamenAdd from "./pages/ExamenAdd";
import Assignation from "./pages/Assignation";


import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import { SiD } from "react-icons/si";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/loginadmin" element={<AdminLogin/>} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index path="dashboard" element={<AdminDashboard />} />
        <Route path="examens" element={<ExamenAdd/>} />
        <Route path="surveillants" element={<Assignation/>} />
        <Route path="Assignation" element={<Assignation/>} />
        <Route path="Notif" element={<Assignation/>} />
        <Route path="profile" element={<Assignation/>} />
      </Route>
    </>
    
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
