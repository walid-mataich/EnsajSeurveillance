import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate, useParams } from "react-router-dom";

const EditMatierePage = () => {
  const [matiere, setMatiere] = useState(null);
  const [chefs, setChefs] = useState([]);
  const [formData, setFormData] = useState({
    nomMatiere: "",
    chefDeModule: "",
    niveau: "", // Champ pour le niveau
  });
  const { idMatiere } = useParams(); // Récupérer l'ID de la matière
  const navigate = useNavigate();

  useEffect(() => {
    fetchMatiere();
    fetchChefs();
  }, [idMatiere]);

  const fetchMatiere = async () => {
    try {
      const response = await api.get(`/matieres/${idMatiere}`);
      setMatiere(response.data);
      setFormData({
        nomMatiere: response.data.nomMatiere,
        chefDeModule: response.data.chefDeModule.id,
        niveau: response.data.niveau,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération de la matière :", error);
    }
  };

  const fetchChefs = async () => {
    try {
      const response = await api.get("/surveillants"); // Liste des chefs de module
      setChefs(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des chefs :", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.put(
        `/matieres/modif/${idMatiere}/${formData.chefDeModule}/${formData.niveau}/${formData.nomMatiere}`
      );
      navigate("/Admin/matieres"); // Rediriger vers la liste des matières après la modification
    } catch (error) {
      console.error("Erreur lors de la modification de la matière :", error);
    }
  };

  if (!matiere) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">
        Modifier la Matière
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nom de la matière
          </label>
          <input
            type="text"
            name="nomMatiere"
            value={formData.nomMatiere}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Chef de module
          </label>
          <select
            name="chefDeModule"
            value={formData.chefDeModule}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          >
            {chefs.map((chef) => (
              <option key={chef.id} value={chef.id}>
                {chef.nom} ({chef.email})
              </option>
            ))}
          </select>
        </div>

        {/* Ajout du champ "niveau" avec les options 2AP-1, 2AP-2 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Niveau de la matière
          </label>
          <select
            name="niveau"
            value={formData.niveau}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="1">2AP-1</option>
            <option value="2">2AP-2</option>
          </select>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm"
          >
            Sauvegarder
          </button>
          <button
            type="button"
            onClick={() => navigate("/Admin/matieres")}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-full text-sm"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMatierePage;
