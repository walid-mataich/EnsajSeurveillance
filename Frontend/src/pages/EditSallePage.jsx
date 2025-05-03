import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate, useParams } from "react-router-dom";

const EditSallePage = () => {
  const [formData, setFormData] = useState({
    nomSale: "",
    type: "",
    nbrDeSurveillant: 0,
  });

  const { idSalle } = useParams(); // ID de la salle dans l'URL
  const navigate = useNavigate();

  useEffect(() => {
    fetchSalle();
  }, [idSalle]);

  const fetchSalle = async () => {
    try {
      const response = await api.get(`/salles/${idSalle}`);
      const salle = response.data;
      setFormData({
        nomSale: salle.nomSale,
        type: salle.type,
        nbrDeSurveillant: salle.nbrDeSurveillant,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération de la salle :", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "nbrDeSurveillant" ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/salles/modif/${idSalle}/${formData.nbrDeSurveillant}/${formData.nomSale}/${formData.type}`);
      navigate("/Admin/salles");
    } catch (error) {
      console.error("Erreur lors de la modification :", error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">Modifier la Salle</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nom de la salle
          </label>
          <input
            type="text"
            name="nomSale"
            value={formData.nomSale}
            onChange={handleInputChange}
            required
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Type
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            required
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="">-- Choisir un type --</option>
            <option value="Amphi">Amphi</option>
            <option value="Salle normale">Salle normale</option>
            <option value="Labo">Labo</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre de surveillants
          </label>
          <input
            type="number"
            name="nbrDeSurveillant"
            value={formData.nbrDeSurveillant}
            onChange={handleInputChange}
            min="0"
            required
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          />
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
            onClick={() => navigate("/Admin/salles")}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-full text-sm"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditSallePage;
