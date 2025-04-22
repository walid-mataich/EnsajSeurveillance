import React, { useState } from "react";
import api from "../api/axios";

const MultiSelectSurveillants = (props) => {
  const [selectedIds, setSelectedIds] = useState([]);

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    console.log("Selected surveillants:", selectedIds);
    for (const id of selectedIds) {
      await api.put(`surveillants/actif/true/${id}`);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <div className="mt-4">
        <h3 className="font-semibold">Surveillants sélectionnés :</h3>
        <ul className="list-disc list-inside list-none text-gray-600">
          {selectedIds.length === 0 ? (
            <li>Aucun surveillant sélectionné</li>
          ) : (
            selectedIds.map((id) => {
              const s = props.surveillants.find((s) => s.id === id);
              return <li key={id}>{s.nom}</li>;
            })
          )}
        </ul>
      </div>
      <h2 className="text-xl font-bold mb-4">Sélectionner les surveillants</h2>
      <ul className="space-y-2">
        {props.surveillants.map((surv) => (
          <li key={surv.id} className="flex items-center space-x-3">
            <input
              type="checkbox"
              id={`surv-${surv.id}`}
              checked={selectedIds.includes(surv.id)}
              onChange={() => handleSelect(surv.id)}
              className="accent-blue-500 w-4 h-4"
            />
            <label htmlFor={`surv-${surv.id}`} className="text-gray-700">
              {surv.nom}
            </label>
          </li>
        ))}
      </ul>

      <button
        className="bg-blue-600 px-5 py-1 text-white rounded cursor-pointer"
        onClick={handleSubmit}
      >
        Ajouter
      </button>
    </div>
  );
};

export default MultiSelectSurveillants;
