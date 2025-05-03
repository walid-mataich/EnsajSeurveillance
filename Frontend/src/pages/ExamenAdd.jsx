import React from "react";
import { useNavigate } from "react-router-dom";
import ExamSchedule from "../components/ExamSchedule";

function ExamenAdd() {
  const navigate = useNavigate();

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
      </div>
    </div>
  );
}

export default ExamenAdd;
