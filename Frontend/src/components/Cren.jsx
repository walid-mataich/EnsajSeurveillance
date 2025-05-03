import React, { useEffect, useRef, useState } from "react";
import api from "../api/axios";
import ChoixBySurv from "./ChoixBySurv";
import ChoixEditor from "./ChoixEditor";

const Cren = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buttonColors, setButtonColors] = useState({});
  const [selectedExam, setSelectedExam] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [survId, setSurvId] = useState("");
  const [choix, setChoix] = useState([]);
  const popupRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setSelectedExam(null); // ferme le popup si clique dehors
      }
    };

    if (selectedExam) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedExam]);

  useEffect(() => {
    const fetchUserConnecter = async () => {
      try {
        const response = await api.get("surveillants/userConnecter");
        setSurvId(response.data.id);
      } catch (error) {
        console.error("Erreur récupération du surveillant connecté:", error);
      }
    };
    fetchUserConnecter();
  }, []);

  useEffect(() => {
    if (survId) {
      api
        .get(`/choix/${survId}`)
        .then((res) => {
          setChoix(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [survId]);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await api.get("/examen/all");
        setExams(response.data);
      } catch (err) {
        setError("Échec du chargement des examens");
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  const getExamsByChefModule = (exams, chefId) => {
    return exams.filter((exam) => exam.matiere.chefDeModule.id === chefId);
  };

  const handleSubmit = async () => {
    const updatedColors = { ...buttonColors };
    const examsChef = getExamsByChefModule(exams, survId);

    examsChef.forEach((exam) => {
      updatedColors[exam.idExamen] = "bg-red-500";
    });

    const nonChoisisExamsIds = exams
      .map((exam) => exam.idExamen)
      .filter((id) => !(id in updatedColors));

    const tempChoices = Object.entries(updatedColors).map(([key, color]) => ({
      idExamen: key,
      ordre:
        color === "bg-red-500"
          ? -1
          : color === "bg-yellow-300"
          ? 0
          : color === "bg-green-500"
          ? 1
          : 0,
    }));

    if (nonChoisisExamsIds.length > 0) {
      const confirm = window.confirm(
        `Vous n'avez pas choisi de préférence pour ${nonChoisisExamsIds.length} examen(s). Voulez-vous continuer ?`
      );
      if (!confirm) return;

      nonChoisisExamsIds.forEach((id) => {
        tempChoices.push({ idExamen: id, ordre: 0 });
      });
    }

    for (const choice of tempChoices) {
      try {
        await api.post(
          `choix/choisir?id=${survId}&idExamen=${choice.idExamen}`,
          { ordre: choice.ordre },
          { headers: { "Content-Type": "application/json" } }
        );
      } catch (error) {
        console.error("Erreur lors de l'envoi des choix:", error);
      }
    }

    alert("Choix soumis avec succès !");
  };

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

  const groupedExams = exams.reduce((acc, exam) => {
    const date = exam.jour;
    if (!acc[date]) acc[date] = [];
    acc[date].push(exam);
    return acc;
  }, {});

  if (loading)
    return <p className="text-center text-gray-600">Chargement...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  if (choix.length > 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-green-700">
            Vous avez déjà soumis vos préférences
          </h1>
          <p className="text-gray-700 text-xl font-bold">
            Vous pouvez les modifier ci-dessous :
          </p>
        </div>

        <ChoixEditor choixList={choix} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 bg-gradient-to-r from-blue-100 to-blue-200 p-6 rounded-lg text-center shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Vos Disponibilités
        </h1>
        <p className="text-gray-700 mb-1">
          Sélectionnez vos préférences de créneaux :
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div> Occupé
          </span>
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-300 rounded-full"></div>{" "}
            Disponible
          </span>
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div> Favorable
          </span>
        </div>
      </div>

      <div className="space-y-8">
        {Object.entries(groupedExams).map(([day, exams]) => (
          <div key={day} className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              {new Date(day).toLocaleDateString("fr-FR", { weekday: "long" })} -{" "}
              {day}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exams.map((exam) => (
                <button
                  key={exam.idExamen}
                  className={`flex flex-col items-center justify-center py-3 px-6 rounded-lg border-2 transition transform hover:scale-105 ${
                    exam.matiere.chefDeModule.id === survId
                      ? "bg-red-500 cursor-not-allowed text-white"
                      : buttonColors[exam.idExamen] || "bg-gray-100"
                  }`}
                  onClick={(event) => {
                    exam.matiere.chefDeModule.id !== survId &&
                      handleOpenColorPicker(exam.idExamen, event);
                  }}
                >
                  <div className="text-lg font-medium">
                    {exam.debut} - {exam.fin}
                  </div>
                  <div className="text-sm text-gray-600">
                    {exam.matiere.nom}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedExam && (
        <div
          ref={popupRef}
          className="absolute p-5 bg-white shadow-lg rounded-lg border border-gray-300 z-50"
          style={{ top: popupPosition.top + 30, left: popupPosition.left }}
        >
          <h3 className="text-lg font-bold mb-4 text-gray-700">
            Choisissez une couleur
          </h3>
          <div className="flex gap-4">
            <button
              className="bg-red-500 text-white py-2 px-4 rounded-full hover:opacity-90"
              onClick={() => handleColorSelect("bg-red-500")}
            >
              Occupé
            </button>
            <button
              className="bg-green-500 text-white py-2 px-4 rounded-full hover:opacity-90"
              onClick={() => handleColorSelect("bg-green-500")}
            >
              Favorable
            </button>
            <button
              className="bg-yellow-300 text-black py-2 px-4 rounded-full hover:opacity-90"
              onClick={() => handleColorSelect("bg-yellow-300")}
            >
              Disponible
            </button>
          </div>
        </div>
      )}

      <div className="text-center mt-10">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition transform hover:scale-105"
          onClick={handleSubmit}
        >
          Valider mes Choix
        </button>
      </div>
    </div>
  );
};

export default Cren;
