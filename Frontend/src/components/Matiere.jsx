import { useEffect, useState } from "react";
import api from "../api/axios";

const Matieres = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    api
      .get("/matieres") // Remplace "/api/data" par ton endpoint réel
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données :", error);
      });
  }, []);

  return (
    <div>
      <h2>Données récupérées :</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default Matieres;
