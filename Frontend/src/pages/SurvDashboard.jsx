import { React, useEffect, useState } from "react";
import api from "../api/axios";
import EmploiSurveillant from "../components/EmploiSurveillant";
import AffectationCard from "../components/AffectationCard";

const SurvDashboard = () => {
  const [name, setname] = useState("");
  const [data, setData] = useState([]);
  const [survId, setSurvId] = useState("");

  useEffect(() => {
    const fetchUserConnecter = async () => {
      try {
        const response = await api.get("surveillants/userConnecter");
        setname(response.data.nom);
        setSurvId(response.data.id);
      } catch (error) {
        console.error("Erreur récupération du surveillant connecté:", error);
      }
    };
    fetchUserConnecter();
  }, []);

  useEffect(() => {
    try {
      api.get(`/affectations/${survId}`).then((response) => {
        setData(response.data);
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    }
  }, [survId]);

  return (
    <>
      <div>
        <div className="flex flex-col items-start p-4 justify-center h-48 mb-4 rounded-sm border border-gray-400">
          <span className="bg-blue-800 text-xl text-white inline-block rounded-full mb-6 px-8 py-2">
            <strong>espace surveillant</strong>
          </span>
          <p className="text-5xl text-indigo-900">
            Bienvenue <strong>{name}</strong>
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center justify-center h-60 rounded-sm border border-gray-400"></div>
          <div className="flex items-center justify-center h-60 rounded-sm border border-gray-400"></div>
        </div>
        <span className=" text-xl text-indigo-900 border-1  inline-block rounded-full mb-6 px-8 py-2">
          <strong>Vos prochaines surveillance</strong>
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {data.map((affectation) => (
            <AffectationCard
              key={affectation.idAffectation}
              affectation={affectation}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default SurvDashboard;
