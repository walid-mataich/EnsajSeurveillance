import React, { useEffect, useState } from "react";
import api from "../api/axios";

const Cren = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buttonColors, setButtonColors] = useState({});
  const [selectedExam, setSelectedExam] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await api.get("/examen/all");
        setExams(response.data);
      } catch (err) {
        setError("Échec du chargement des données");
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  if (loading)
    return <p className="text-center text-gray-600">Chargement...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  const handleOpenColorPicker = (idExamen, event) => {
    setSelectedExam(idExamen);
    const rect = event.target.getBoundingClientRect();
    setPopupPosition({
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
    });
  };

  const handleColorSelect = (color) => {
    setButtonColors((prevColors) => ({ ...prevColors, [selectedExam]: color }));
    setSelectedExam(null);
  };

  const handleSubmit = async () => {
    try {
      await api.post("/preferences", buttonColors);
      alert("Préférences enregistrées avec succès !");
    } catch (error) {
      alert("Erreur lors de l'enregistrement des préférences.");
    }
  };

  const groupedExams = exams.reduce((acc, exam) => {
    const date = exam.jour;
    if (!acc[date]) acc[date] = [];
    acc[date].push(exam);
    return acc;
  }, {});

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 p-3 bg-gray-100 rounded-lg text-center">
        <p className="text-gray-700">
          Veuillez choisir les couleurs selon vos préférences :
        </p>
        <p className="text-red-500 font-semibold">
          🔴 Rouge : Vous êtes occupé
        </p>
        <p className="text-yellow-500 font-semibold">
          🟡 Jaune : Vous êtes disponible
        </p>
        <p className="text-green-500 font-semibold">
          🟢 Vert : C'est favorable
        </p>
      </div>
      <div>
        {Object.entries(groupedExams).map(([day, exams]) => (
          <div key={day} className="bg-white shadow-md rounded-lg mb-4 p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              {new Date(day).toLocaleDateString("fr-FR", { weekday: "long" })} -{" "}
              {day}
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {exams.map((exam) => (
                <button
                  key={exam.idExamen}
                  className={`py-2 px-4 rounded-lg shadow-md transition duration-200 text-black border border-gray-400 cursor-cell ${
                    buttonColors[exam.idExamen] || "bg-white"
                  }`}
                  onClick={(event) =>
                    handleOpenColorPicker(exam.idExamen, event)
                  }
                >
                  {exam.debut} - {exam.fin}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {selectedExam && (
        <div
          className="absolute p-4 bg-white shadow-lg rounded-lg border border-gray-300"
          style={{ top: popupPosition.top + 30, left: popupPosition.left }}
        >
          <h3 className="text-lg font-semibold mb-2">Choisissez une couleur</h3>
          <div className="flex gap-4">
            <button
              className="bg-red-500 text-white py-2 px-4 rounded-lg cursor-pointer"
              onClick={() => handleColorSelect("bg-red-500")}
            >
              Rouge
            </button>
            <button
              className="bg-green-500 text-white py-2 px-4 rounded-lg cursor-pointer"
              onClick={() => handleColorSelect("bg-green-500")}
            >
              Vert
            </button>
            <button
              className="bg-yellow-300 text-white py-2 px-4 rounded-lg cursor-pointer"
              onClick={() => handleColorSelect("bg-yellow-300")}
            >
              Jaune
            </button>
          </div>
        </div>
      )}
      <div className="text-center mt-6">
        <button
          className="bg-blue-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-600 transition"
          onClick={handleSubmit}
        >
          Soumettre
        </button>
      </div>
    </div>
  );
};

export default Cren;
