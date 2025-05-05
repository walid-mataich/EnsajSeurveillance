import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

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
import api from "./api/axios";
import LoadingPulse from "./components/LoadingPulse";
import ExamenForm from "./components/ExamenForm";
import SalleForm from "./components/SalleForm";
import AddMatieres from "./components/AddMatieres";
import EditMatierePage from "./pages/EditMatierePage";
import EditSallePage from "./pages/EditSallePage";

import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import ModifierMp from "./pages/ModifierMp";
import AdminManagement from "./pages/AdminManagement";
import Emploi from "./pages/Emploi";
import ListeAdmin from "./pages/ListeAdmin";
import ListeSurv from "./pages/ListeSurv";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Notification from "./pages/Notification";
// import MatieresPage from "./pages/MatieresPage";
import SallesPage from "./pages/SallesPage";
import MatieresPage from "./pages/MatieresPage";
import TestChoix from "./components/TestChoix";
import MonHistorique from "./components/MonHistorique";
import HistoriqueSurv from "./pages/HistoriqueSurv";
import MotpassOublier from "./pages/SurvMotpassOublier";
import ResetPassword from "./pages/SurvMotpasseReset";
import SurvResetPasswordGuard from "./components/SurvResetPasswordGuard";
import AdminForgotPassword from './pages/AdminMPOublier';
import AdminResetPassword from './pages/AdminMPReset';
import AdminResetPasswordGuard from "./components/AdminResetPasswordGuard";


// Route privée pour administrateur : redirige vers /loginadmin si pas de token
const AdminPrivateRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("jwtTokenadmin");

      if (!token) {
        setIsValid(false);
        return;
      }

      try {
        const response = await api.get("/Admin/validToken");
        console.log("Validation token OK", response.data);
        setIsValid(true);
      } catch (error) {
        console.error('Token invalide ou erreur API:', error);
        localStorage.removeItem("jwtTokenadmin");
        setIsValid(false);
      }
    };

    verifyToken();
  }, []);

  if (isValid === null)
    return (
      <div>
        <LoadingPulse />
      </div>
    );
  return isValid ? children : <Navigate to="/loginadmin" replace />;
};

// Route privée pour surveillant : redirige vers /loginsurv si pas de token
const SurvPrivateRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("jwtTokensurv");

      if (!token) {
        setIsValid(false);
        return;
      }

      try {
        const response = await api.get("/surveillants/validToken");
        console.log("Validation token surveillant OK", response.data);
        setIsValid(true);
      } catch (error) {
        console.error('Token surveillant invalide ou erreur API:', error);
        localStorage.removeItem("jwtTokensurv");
        setIsValid(false);
      }
    };

    verifyToken();
  }, []);

  if (isValid === null)
    return (
      <div>
        <LoadingPulse />
      </div>
    );
  return isValid ? children : <Navigate to="/loginsurv" replace />;
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
        <Route path="Notif" element={<Notification />} />
        <Route path="Profile" element={<Profile />} />
        <Route path="listeAdmin" element={<ListeAdmin />} />
        <Route path="listeSurv" element={<ListeSurv />} />
        <Route path="ajouterAdmin" element={<AdminManagement />} />
        <Route path="ModifierMp" element={<ModifierMp />} />
        <Route path="add-examen" element={<ExamenForm />} />
        <Route path="add-salle" element={<SalleForm />} />
        <Route path="add-matiere" element={<AddMatieres />} />
        <Route path="salles" element={<SallesPage />} />
        <Route path="matieres" element={<MatieresPage />} />
        <Route path="edit-matiere/:idMatiere" element={<EditMatierePage />} />
        <Route path="edit-salle/:idSalle" element={<EditSallePage />} />
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
        <Route path="emploi" element={<Emploi />} />
        <Route path="profile" element={<Profile />} />
        <Route path="test" element={<TestChoix />} />
        <Route path="monHistorique" element={<HistoriqueSurv />} />
      </Route>
      <Route path="/" element={<HomePage />} />
      <Route path="/log" element={<Log />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/survOublier" element={<MotpassOublier />} />
      <Route path="/adminOublier" element={<AdminForgotPassword/>} />
      <Route path="/adminResetMp" element={
        <AdminResetPasswordGuard>
          <AdminResetPassword />
          </AdminResetPasswordGuard>} />
      <Route
  path="/survResetMp"
  element={
    <SurvResetPasswordGuard>
      <ResetPassword />
    </SurvResetPasswordGuard>
  }
/>

    </>
  )
);


function App() {
  return <RouterProvider router={router} />;
}

export default App;
