import React from "react";
import { Navigate } from "react-router-dom";

import "./App.css";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import SurvLogin from "./pages/SurvLogin";
import AdminLayout from "./layouts/AdminLayout";
import ExamenAdd from "./pages/ExamenAdd";
import Assignation from "./pages/Assignation";
import SurveillantsManag from "./pages/SurveillantsManag";
import SurvDashboard from "./pages/SurvDashboard";
import SurvLayout from "./layouts/SurvLayout";
import Cren from "./components/cren";
import HomePage from "./pages/Home";
import Log from "./pages/Log";
import Profile from "./pages/Profile";

import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import ModifierMp from "./pages/ModifierMp";
import AdminManagement from "./pages/AdminManagement";
import ListeAdmin from "./pages/ListeAdmin";
import ListeSurv from "./pages/ListeSurv";


// Route privée pour administrateur : redirige vers /loginadmin si pas de token
const AdminPrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("jwtTokenadmin");
  return isAuthenticated ? children : <Navigate to="/loginadmin" replace />;
};

// Route privée pour surveillant : redirige vers /loginsurv si pas de token
const SurvPrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("jwtTokensurv");
  return isAuthenticated ? children : <Navigate to="/loginsurv" replace />;
};
//test

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
        <Route path="ajoutSurv" element={<SurveillantsManag />} />
        <Route path="Assignation" element={<Assignation />} />
        <Route path="Notif" element={<Assignation />} />
        <Route path="profile" element={<Profile />} />
        <Route path="listeAdmin" element={<ListeAdmin/>}/>
        <Route path="listeSurv" element={<ListeSurv/>}/>
        <Route path="ajouterAdmin" element={<AdminManagement/>}/>
        <Route path="ModifierMp" element={<ModifierMp />} />
        


        
      </Route>

      {/* Route protégée pour surveillant */}
      <Route
        path="/surv"
        element={
          <SurvPrivateRoute>
            <SurvLayout />
          </SurvPrivateRoute>
        }
      >
        <Route index path="dashboard" element={<SurvDashboard />} />
        <Route path="choix" element={<Cren />} />
        <Route path="ModifierMp" element={<ModifierMp />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="/" element={<HomePage />} />
      <Route path="/log" element={<Log />} />

    </>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
