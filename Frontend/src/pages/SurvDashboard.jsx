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
        const sortedData = response.data.sort(
          (a, b) => new Date(a.examen.jour) - new Date(b.examen.jour)
        );
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
 
        <span className=" text-xl text-indigo-900 border-1  inline-block rounded-full mb-6 px-8 py-2">
          <strong>Vos prochaines surveillances</strong>
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {data.map((affectation) => (
            <AffectationCard
              key={affectation.idAffectation}
              affectation={affectation}
            />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center justify-center h-60 rounded-sm border border-gray-400 text-center flex-col">
            <p className="text-6xl font-extrabold text-blue-800">
              {data.length}
            </p>
            <p className="text-2xl text-indigo-900 mt-4">
              Nombre total de surveillances
            </p>
          </div>

          <div className="flex items-center justify-center h-60 rounded-sm border border-gray-400 text-center flex-col">
            {data.length > 0 ? (
              <>
                <p className="text-2xl font-semibold text-indigo-900 mb-4">
                  Prochaine surveillance
                </p>
                <p className="text-4xl text-blue-800 font-bold">
                  {new Date(data[0].examen.jour).toLocaleDateString()}
                </p>
              </>
            ) : (
              <p className="text-xl text-gray-500">
                Aucune surveillance à venir
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SurvDashboard;
