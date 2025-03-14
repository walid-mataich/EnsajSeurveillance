import { useEffect, useState } from "react";
import api from "../api/axios";

const Professeurs = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    api
      .get("/surveillants") // Update with your actual API endpoint
      .then(response => {
        console.log("Fetched data:", response.data); // Log the data
        setData(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données :", error);
      });
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Liste des Professeurs</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="border border-gray-300 px-4 py-2">Nom</th>
              <th className="border border-gray-300 px-4 py-2">Username</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Type</th>
              <th className="border border-gray-300 px-4 py-2">Nbr. Surveillance</th>
              <th className="border border-gray-300 px-4 py-2">Matières</th>
            </tr>
          </thead>
          <tbody>
            {data.map((prof, index) => (
              <tr key={prof.id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                <td className="border border-gray-300 px-4 py-2">{prof.nom}</td>
                <td className="border border-gray-300 px-4 py-2">{prof.username}</td>
                <td className="border border-gray-300 px-4 py-2">{prof.email}</td>
                <td className="border border-gray-300 px-4 py-2">{prof.type}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{prof.nbrSurveillance}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {prof.matieres.map((matiere) => (
                    <span key={matiere.idMatiere} className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded-md mr-1">
                      {matiere.nomMatiere}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Professeurs;
