import React from "react";
import { useNavigate } from "react-router-dom";
import ExamSchedule from "../components/ExamSchedule";

function ExamenAdd() {
  const navigate = useNavigate();

  const handleReset = async () => {
    const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer tous les examens ?");
    if (!confirmed) return;

    try {
      await api.delete("/examen/delete"); // <--- adapte cette route selon ton backend
      alert("Tous les examens ont été supprimés.");
      window.location.reload(); // Ou mettre à jour les données si tu préfères
    } catch (error) {
      console.error("Erreur lors de la suppression des examens :", error);
      alert("Échec de la suppression.");
    }
  };

  return (
    <div className="p-6">
      

      <ExamSchedule />

      {/* Buttons */}
      <div className="flex justify-center gap-4 my-8">
        <button
          onClick={() => navigate("/Admin/add-examen")}
          className="bg-blue-600 text-white font-bold py-2 px-6 rounded hover:bg-blue-700 transition"
        >
          Ajouter Examen
        </button>
        <button
          onClick={() => navigate("/Admin/add-salle")}
          className="bg-blue-600 text-white font-bold py-2 px-6 rounded hover:bg-blue-700 transition"
        >
          Ajouter Salle
        </button>
        <button
          onClick={() => navigate("/Admin/add-matiere")}
          className="bg-blue-600 text-white font-bold py-2 px-6 rounded hover:bg-blue-700 transition"
        >
          Ajouter Matière
        </button>
        {/* Bouton Réinitialiser */}
      
        <button
          onClick={handleReset}
          className="bg-red-600 text-white font-bold py-2 px-6 rounded hover:bg-red-700 transition"
        >
          Réinitialiser
        </button>
      
      </div>
    </div>
  );
}

export default ExamenAdd;
