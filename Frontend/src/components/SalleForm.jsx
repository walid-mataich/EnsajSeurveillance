import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const SalleForm = () => {
  const [nomSale, setNomSale] = useState("");
  const [type, setType] = useState("");
  const [nbrDeSurveillant, setNbrDeSurveillant] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newSalle = { nomSale, type, nbrDeSurveillant };

    try {
      await api.post("/salles/add", newSalle, {
        headers: { "Content-Type": "application/json" },
      });
      setMessage("Salle ajoutée avec succès !");
      setNomSale("");
      setType("");
      setNbrDeSurveillant("");
    } catch (error) {
      setMessage("Erreur lors de l'ajout de la salle.");
      console.error(error);
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
      <div className="max-w-2xl mx-auto p-8 bg-white shadow-2xl rounded-xl mt-12">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
          Ajouter une Salle
        </h2>
        {message && (
          <p className="text-center text-green-600 font-medium">{message}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <label className="block">
            <span className="text-lg font-medium text-gray-700">Nom Salle</span>
            <input
              type="text"
              value={nomSale}
              onChange={(e) => setNomSale(e.target.value)}
              required
              className="mt-2 block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </label>

          <label className="block">
            <span className="text-lg font-medium text-gray-700">Type</span>
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mt-2 block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </label>

          <label className="block">
            <span className="text-lg font-medium text-gray-700">
              Nombre de Surveillants
            </span>
            <input
              type="number"
              min="0"
              value={nbrDeSurveillant}
              onChange={(e) => setNbrDeSurveillant(e.target.value)}
              className="mt-2 block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </label>

          <button
            type="submit"
            className="w-full py-3 text-lg font-medium text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition duration-300"
          >
            Ajouter Salle
          </button>
        </form>
      </div>
    </>
  );
};

export default SalleForm;
