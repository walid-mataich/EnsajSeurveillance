import React from "react";
import { useEffect } from "react";
import api from "../api/axios";
import EmploiSurveillant from "../components/EmploiSurveillant";

const Emploi = () => {
  const [data, setData] = React.useState([]);
  const [survId, setSurvId] = React.useState("");

  useEffect(() => {
    const fetchUserConnecter = async () => {
      try {
        const response = await api.get("surveillants/userConnecter");
        const surv = response.data;
        console.log("surv", surv)

        setSurvId(surv.id);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération du surveillant connecter",
          error
        );
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
        Emploi de Surveillance
      </h1>
      <EmploiSurveillant affectations={data} />
    </div>
  );
};

export default Emploi;
