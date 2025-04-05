import React, { useEffect, useState } from "react";
import axios from "axios";

const PlanningTable = ({ niveau, affectations }) => {
  const [grouped, setGrouped] = useState({});

  useEffect(() => {
    const groupBySlot = {};
    affectations
      .filter((a) => a.examen.matiere.niveau === niveau)
      .forEach((a) => {
        const key = `${a.examen.jour} ${a.examen.debut}–${a.examen.fin} - ${a.examen.matiere.nomMatiere}`;
        if (!groupBySlot[key]) groupBySlot[key] = {};
        groupBySlot[key][a.salle.nomSale] = a.surveillant.nom;
      });

    setGrouped(groupBySlot);
  }, [affectations, niveau]);

  // Get all unique salles
  const salleNames = Array.from(
    new Set(affectations.map((a) => a.salle.nomSale))
  ).sort();

  return (
    <div className="overflow-auto mb-10">
      <h2 className="text-xl font-bold text-center mb-4">
        Planning de Surveillance - Niveau {niveau}
      </h2>
      <table className="min-w-full table-auto border border-gray-300 text-sm text-center">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Salles</th>
            {Object.keys(grouped).map((slot) => (
              <th key={slot} className="border px-2 py-1">
                {slot.split(" - ")[1]} <br />
                <span className="text-xs text-gray-600">
                  {slot.split(" - ")[0]}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {salleNames.map((salle) => (
            <tr key={salle}>
              <td className="border px-2 py-1 font-medium">{salle}</td>
              {Object.keys(grouped).map((slot) => (
                <td key={slot} className="border px-2 py-1">
                  {grouped[slot][salle] || ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Rslt = () => {
  const [affectations, setAffectations] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/affectations") // Update this with your actual endpoint
      .then((res) => {
        console.log("Affectations:", res.data);
        setAffectations(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-8">
        Planning de Surveillance - Année Universitaire 2024/2025
      </h1>
      <PlanningTable niveau={1} affectations={affectations} />
      <PlanningTable niveau={2} affectations={affectations} />
    </div>
  );
};

export default Rslt;
