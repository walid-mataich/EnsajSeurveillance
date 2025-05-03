import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const AddMatieres = () => {
  const [chefs, setChefs] = useState([]);
  const [nomMatiere, setNomMatiere] = useState("");
  const [niveau, setNiveau] = useState("");
  const [chef, setChef] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchSurveillants = async () => {
      try {
        const response = await api.get("surveillants");
        setChefs(response.data);
        console.log("Surveillants récupérés :", response.data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des surveillants :",
          error
        );
      }
    };

    fetchSurveillants();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nomMatiere || !niveau || !chef) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    try {
      await api.post(`/matieres/add/${nomMatiere}/${niveau}/${chef}`);
      console.log("Matière ajoutée avec succès.");
      setNomMatiere("");
      setNiveau("");
      setChef("");
      setSuccessMessage("✅ Matière ajoutée avec succès !");
      setTimeout(() => setSuccessMessage(""), 3000); // Effacer après 3s
    } catch (error) {
      console.error("Erreur lors de l'ajout de la matière :", error);
    }
  };

  return (
    <>
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Retour
      </button>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 p-6 bg-white shadow-md rounded-lg max-w-md mx-auto mt-10"
      >
        {/* Message de confirmation */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative text-sm text-center">
            {successMessage}
          </div>
        )}

        {/* Nom de la Matière */}
        <div>
          <label
            htmlFor="nomMatiere"
            className="block text-gray-700 font-medium mb-2"
          >
            Nom de la Matière
          </label>
          <input
            type="text"
            id="nomMatiere"
            value={nomMatiere}
            onChange={(e) => setNomMatiere(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Entrez le nom de la matière"
          />
        </div>

        {/* Niveau */}
        <div>
          <label
            htmlFor="niveau"
            className="block text-gray-700 font-medium mb-2"
          >
            Niveau
          </label>
          <select
            id="niveau"
            value={niveau}
            onChange={(e) => setNiveau(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Sélectionnez un niveau</option>
            <option value="1">2AP-1</option>
            <option value="2">2AP-2</option>
          </select>
        </div>

        {/* Chef de Matière */}
        <div>
          <label
            htmlFor="chef"
            className="block text-gray-700 font-medium mb-2"
          >
            Chef de Matière
          </label>
          <select
            id="chef"
            value={chef}
            onChange={(e) => setChef(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Sélectionnez un chef</option>
            {chefs.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nom}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full shadow-md transition transform hover:scale-105"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </>
  );
};

export default AddMatieres;
