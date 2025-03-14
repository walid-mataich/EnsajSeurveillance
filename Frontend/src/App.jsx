import React from "react";
import "./App.css";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import Home from "./pages/Home";
import SurvDashboard from "./pages/SurvDashboard";
import SurvLogin from "./pages/SurvLogin";

import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" index element={<AdminDashboard />} />
    </>
  )
);

function App() {
  return <RouterProvider router = {router}/>;
}

export default App;
