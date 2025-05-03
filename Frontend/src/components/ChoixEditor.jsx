import React, { useRef, useState, useEffect } from "react";
import api from "../api/axios";

const ChoixEditor = ({ choixList }) => {
  const [modifications, setModifications] = useState(() =>
    choixList.reduce((acc, choix) => {
      acc[choix.examen.idExamen] = choix.ordre;
      return acc;
    }, {})
  );
  const [popupVisible, setPopupVisible] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const buttonRefs = useRef({});
  const popupRef = useRef();

  const ordreToColor = {
    "-1": "bg-red-500 text-white",
    0: "bg-yellow-300 text-black",
    1: "bg-green-500 text-white",
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target) &&
        !Object.values(buttonRefs.current).some((ref) => ref.contains(e.target))
      ) {
        setPopupVisible(null);
      }
    };

    if (popupVisible) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [popupVisible]);

  const handleClick = (idExamen, e) => {
    const rect = buttonRefs.current[idExamen].getBoundingClientRect();
    setPopupPosition({
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
    });
    setPopupVisible(idExamen);
  };

  const handleOrdreChange = (idExamen, newOrdre) => {
    setModifications((prev) => ({ ...prev, [idExamen]: newOrdre }));
    setPopupVisible(null);
  };

  const handleSubmit = async () => {
    for (const choix of choixList) {
      const idExamen = choix.examen.idExamen;
      const originalOrdre = choix.ordre;
      const newOrdre = modifications[idExamen];

      if (originalOrdre != newOrdre) {
        try {
          await api.put(`/choix/modifier/${choix.idChoix}/${newOrdre}`, {
            headers: { "Content-Type": "application/json" },
          });
        } catch (err) {
          console.error("Erreur lors de la modification :", err);
        }
      }
    }

    alert("Modifications enregistrées !");
    window.location.reload();
  };

  // Group by day, then sort by time
  const groupedByDay = choixList.reduce((acc, choix) => {
    const jour = choix.examen.jour;
    if (!acc[jour]) acc[jour] = [];
    acc[jour].push(choix);
    return acc;
  }, {});

  Object.keys(groupedByDay).forEach((day) => {
    groupedByDay[day].sort((a, b) =>
      a.examen.debut.localeCompare(b.examen.debut)
    );
  });

  return (
    <div className="container mx-auto p-6">
    

      {Object.entries(groupedByDay)
        .sort(([jourA], [jourB]) => new Date(jourA) - new Date(jourB))
        .map(([jour, items]) => (
          <div key={jour} className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              {new Date(jour).toLocaleDateString("fr-FR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map((choix) => {
                const id = choix.examen.idExamen;
                return (
                  <button
                    key={id}
                    ref={(el) => (buttonRefs.current[id] = el)}
                    className={`w-full text-left flex flex-col items-center justify-center py-3 px-6 rounded-lg border-2 transition transform hover:scale-105 ${
                      ordreToColor[modifications[id]]
                    }`}
                    onClick={(e) => handleClick(id, e)}
                  >
                    <div className="text-lg font-medium">
                      {choix.examen.debut} - {choix.examen.fin}
                    </div>
                    <div className="text-sm">{choix.examen.matiere.nom}</div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

      {popupVisible && (
        <div
          ref={popupRef}
          className="absolute p-4 bg-white shadow-lg rounded-lg border border-gray-300 z-50"
          style={{ top: popupPosition.top + 40, left: popupPosition.left }}
        >
          <h3 className="text-sm font-bold mb-2 text-gray-700">Modifier</h3>
          <div className="flex gap-4">
            <button
              className="bg-red-500 text-white py-2 px-4 rounded-full hover:opacity-90"
              onClick={() => handleOrdreChange(popupVisible, -1)}
            >
              Occupé
            </button>
            <button
              className="bg-green-500 text-white py-2 px-4 rounded-full hover:opacity-90"
              onClick={() => handleOrdreChange(popupVisible, 1)}
            >
              Favorable
            </button>
            <button
              className="bg-yellow-300 text-black py-2 px-4 rounded-full hover:opacity-90"
              onClick={() => handleOrdreChange(popupVisible, 0)}
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
          Valider mes modifications
        </button>
      </div>
    </div>
  );
};

export default ChoixEditor;
