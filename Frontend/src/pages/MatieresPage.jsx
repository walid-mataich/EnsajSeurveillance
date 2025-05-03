import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const MatieresPage = () => {
  const [groupedMatieres, setGroupedMatieres] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [matiereToDelete, setMatiereToDelete] = useState(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    fetchMatieres();
  }, []);

  const fetchMatieres = async () => {
    try {
      const response = await api.get("/matieres");
      const matieres = response.data;

      const grouped = matieres.reduce((acc, matiere) => {
        const niveau = matiere.niveau;
        if (!acc[niveau]) acc[niveau] = [];
        acc[niveau].push(matiere);
        return acc;
      }, {});

      setGroupedMatieres(grouped);
    } catch (error) {
      console.error("Erreur lors de la récupération des matières :", error);
    }
  };

  const handleDeleteConfirmation = (matiere, event) => {
    setMatiereToDelete(matiere);

    // Calculer la position de la matière cliquée
    const rect = event.target.getBoundingClientRect();
    // Calculer la position du modal, en ajoutant un espacement pour ne pas toucher le bord
    const modalLeft = rect.right + window.scrollX + 10; // Ajout d'un espacement de 10px
    const modalTop = rect.top + window.scrollY;

    // Vérifier si la position du modal dépasse le bord droit de la fenêtre
    const maxLeft = window.innerWidth - 250; // 250px est la largeur estimée du modal
    const finalLeft = modalLeft > maxLeft ? maxLeft : modalLeft;

    setModalPosition({
      top: modalTop,
      left: finalLeft,
    });

    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/matieres/delete/${matiereToDelete.idMatiere}`);
      setSuccessMessage("✅ La matière a été supprimée avec succès !");
      fetchMatieres();
      setTimeout(() => setSuccessMessage(""), 3000);
      setIsModalOpen(false); // Fermer le modal après suppression
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false); // Fermer le modal si l'utilisateur annule
    setMatiereToDelete(null);
  };

  const handleEdit = (matiere) => {
    alert(`Modification de la matière : ${matiere.nomMatiere}`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">Matières</h1>

      {/* Message de succès */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-center mb-6">
          {successMessage}
        </div>
      )}

      <button
        onClick={() => navigate("/Admin/add-matiere")}
        className="my-10 cursor-pointer bg-blue-600 text-white font-bold py-2 px-6 rounded hover:bg-blue-700 transition"
      >
        Ajouter Matière
      </button>

      {Object.keys(groupedMatieres).map((niveau) => (
        <div key={niveau} className="mb-10">
          <h2 className="text-xl font-bold text-blue-700 mb-4">
            2AP - {niveau}
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
            {groupedMatieres[niveau].map((matiere) => (
              <div
                key={matiere.idMatiere}
                className="bg-white border rounded-xl shadow-md p-4 hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {matiere.nomMatiere}
                </h3>
                <p className="mt-1 text-gray-700 text-sm">
                  Chef de module : <strong>{matiere.chefDeModule.nom}</strong>
                </p>
                <p className="text-gray-500 text-sm">
                  {matiere.chefDeModule.email}
                </p>
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={() =>
                      navigate(`/admin/edit-matiere/${matiere.idMatiere}`)
                    }
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded-full text-sm"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={(event) =>
                      handleDeleteConfirmation(matiere, event)
                    }
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-full text-sm"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Modal de confirmation positionné à côté de la matière */}
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
            Êtes-vous sûr de vouloir supprimer "{matiereToDelete?.nomMatiere}" ?
          </p>
          <div className="mt-4 flex justify-end gap-4">
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm"
            >
              Confirmer
            </button>
            <button
              onClick={() =>
                navigate(`/admin/edit-matiere/${matiere.idMatiere}`)
              }
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

export default MatieresPage;
