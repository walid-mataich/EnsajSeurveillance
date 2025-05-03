import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const SallesPage = () => {
  const [salles, setSalles] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [salleToDelete, setSalleToDelete] = useState(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    fetchSalles();
  }, []);

  const fetchSalles = async () => {
    try {
      const response = await api.get("/salles");
      setSalles(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des salles :", error);
    }
  };

  const handleDeleteConfirmation = (salle, event) => {
    setSalleToDelete(salle);

    const rect = event.target.getBoundingClientRect();
    const modalLeft = rect.right + window.scrollX + 10;
    const modalTop = rect.top + window.scrollY;
    const maxLeft = window.innerWidth - 250;
    const finalLeft = modalLeft > maxLeft ? maxLeft : modalLeft;

    setModalPosition({
      top: modalTop,
      left: finalLeft,
    });

    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/salles/delete/${salleToDelete.idSalle}`);
      setSuccessMessage("✅ La salle a été supprimée avec succès !");
      fetchSalles();
      setTimeout(() => setSuccessMessage(""), 3000);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
    setSalleToDelete(null);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">Salles</h1>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-center mb-6">
          {successMessage}
        </div>
      )}

      <button
        onClick={() => navigate("/admin/add-salle")}
        className="my-10 cursor-pointer bg-blue-600 text-white font-bold py-2 px-6 rounded hover:bg-blue-700 transition"
      >
        Ajouter Salle
      </button>

      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
        {salles.map((salle) => (
          <div
            key={salle.idSalle}
            className="bg-white border rounded-xl shadow-md p-4 hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold text-gray-800">
              {salle.nomSale}
            </h3>
            <p className="text-gray-600 mt-1">Type : {salle.type}</p>
            <p className="text-gray-600">
              Nombre de surveillants : {salle.nbrDeSurveillant}
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => navigate(`/admin/edit-salle/${salle.idSalle}`)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded-full text-sm"
              >
                Modifier
              </button>
              <button
                onClick={(event) => handleDeleteConfirmation(salle, event)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-full text-sm"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div
          className="absolute bg-white p-6 rounded-lg shadow-lg z-100"
          style={{
            top: modalPosition.top,
            left: modalPosition.left,
            minWidth: "200px",
          }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Confirmer la suppression
          </h3>
          <p className="text-sm text-gray-600">
            Êtes-vous sûr de vouloir supprimer la salle "
            {salleToDelete?.nomSale}" ?
          </p>
          <div className="mt-4 flex justify-end gap-4">
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm"
            >
              Confirmer
            </button>
            <button
              onClick={handleCancelDelete}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-full text-sm"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SallesPage;
