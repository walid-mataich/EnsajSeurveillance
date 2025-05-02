import React, { useState, useEffect } from "react";
import CountUp from "../components/Count";
import LabelsAboveBars from "../components/BarChartOne";
import { Users, School } from "lucide-react";
import api from "../api/axios";

function AdminDashboard() {
  const [surveillants, setSurveillants] = useState([]);
  const [exams, setExams] = useState([]);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const fetchSurv = async () => {
      try {
        const response2 = await api.get("surveillants");
        setSurveillants(response2.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des surveillants:", error);
      }
    };
    fetchSurv();
  }, []);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await api.get("Admin/userConnecter");
        setAdmin(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur connecté", error);
      }
    };
    fetchAdmin();
  }, []);

  useEffect(() => {
    const fetchex = async () => {
      try {
        const response = await api.get("examen/all");
        setExams(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des examens:", error);
      }
    };
    fetchex();
  }, []);

  return (
    <div className="p-4">
      <div className="flex flex-col items-start justify-center h-48 mb-6 p-4 rounded-sm border border-gray-400">
        <span className="bg-blue-800 text-white text-lg sm:text-xl rounded-full mb-4 px-6 py-2">
          <strong>Espace administrateur</strong>
        </span>
        <p className="text-3xl sm:text-4xl text-indigo-900">
          Bienvenue <strong>{admin?.nom || "..."}</strong>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col items-center justify-center w-full rounded-sm border border-gray-400 p-4">
          <h1 className="text-xl sm:text-2xl text-indigo-900 mb-4">Types des surveillants</h1>
          <LabelsAboveBars />
        </div>

        <div className="flex items-center justify-center w-full rounded-sm border border-gray-400 p-4">
          <div className="flex flex-col sm:flex-row justify-around w-full gap-6 bg-white p-4 rounded shadow-sm">
            <div className="flex flex-col items-center w-full sm:w-1/2">
              <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                <School className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                Nombre d'examens
              </h1>
              <CountUp
                from={0}
                to={exams.length}
                separator=","
                direction="up"
                duration={1}
                className="count-up-text text-4xl sm:text-5xl font-bold text-blue-800 mt-2"
              />
            </div>

            <div className="flex flex-col items-center w-full sm:w-1/2">
              <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                Nombre de surveillants
              </h1>
              <CountUp
                from={0}
                to={surveillants.length}
                separator=","
                direction="up"
                duration={1}
                className="count-up-text text-4xl sm:text-5xl font-bold text-blue-800 mt-2"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
