import { React, useState, useEffect } from "react";
import MonHistorique from "../components/MonHistorique";
import api from "../api/axios";

const HistoriqueSurv = () => {
  const [survId, setSurvId] = useState("");
  const [hist, setHist] = useState([]);

  useEffect(() => {
    const fetchUserConnecter = async () => {
      try {
        const response = await api.get("surveillants/userConnecter");
        console.log("survId", response.data.id);
        setSurvId(response.data.id);
      } catch (error) {
        console.error("Erreur récupération du surveillant connecté:", error);
      }
    };
    fetchUserConnecter();
  }, []);

  useEffect(() => {
    api.get(`affectations/historique/${survId}`)
      .then((res) => setHist(res.data))
      .catch((err) => console.log(err));
  }, [survId]);

  return <MonHistorique historique={hist} />;
};

export default HistoriqueSurv;
