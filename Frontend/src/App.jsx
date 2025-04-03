import React from "react";
import "./App.css";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLayout from "./layouts/AdminLayout";
import ExamenAdd from "./pages/ExamenAdd";
import Assignation from "./pages/Assignation";
import SurveillantsManag from "./pages/SurveillantsManag";
import SurvDashboard from "./pages/SurvDashboard";
import SurvLayout from "./layouts/SurvLayout";
import Cren from "./components/cren";

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
      <Route path="/admin" element={<AdminLayout />}>
        <Route index path="dashboard" element={<AdminDashboard />} />
        <Route path="examens" element={<ExamenAdd />} />
        <Route path="surveillants" element={<SurveillantsManag />} />
        <Route path="Assignation" element={<Assignation />} />
        <Route path="Notif" element={<Assignation />} />
        <Route path="profile" element={<Assignation />} />
      </Route>

      <Route path="/surv" element={<SurvLayout />}>
        <Route index path="dashboard" element={<AdminDashboard />} />
        <Route path="choix" element={<Cren />} />
      </Route>
    </>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
