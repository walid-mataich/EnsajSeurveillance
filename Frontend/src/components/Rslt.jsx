import React, { useEffect, useState } from "react";
import api from "../api/axios";
import LoadingPulse from "./LoadingPulse";

const PlanningTable = ({ niveau, affectations }) => {
  const [slotsByDate, setSlotsByDate] = useState({});
  const [sortedDates, setSortedDates] = useState([]);
  const [salleNames, setSalleNames] = useState([]);

  useEffect(() => {
    const filtered = affectations.filter(
      (a) => a.examen.matiere.niveau === niveau
    );

    const salleSet = new Set();
    const temp = {};

    filtered.forEach((a) => {
      salleSet.add(a.salle.nomSale);
      const date = a.examen.jour;
      const slotKey = `${a.examen.debut}–${a.examen.fin} - ${a.examen.matiere.nomMatiere}`;
      if (!temp[date]) temp[date] = {};
      if (!temp[date][slotKey]) temp[date][slotKey] = {};
      if (!temp[date][slotKey][a.salle.nomSale]) {
        temp[date][slotKey][a.salle.nomSale] = [];
      }
      temp[date][slotKey][a.salle.nomSale].push(a.surveillant.nom);
    });

    // Sort dates and their slots
    const sortedDateKeys = Object.keys(temp).sort(
      (a, b) => new Date(a) - new Date(b)
    );
    const sortedSlots = {};
    sortedDateKeys.forEach((date) => {
      const slots = Object.entries(temp[date]).sort((a, b) => {
        const [aStart] = a[0].split("–");
        const [bStart] = b[0].split("–");
        return aStart.localeCompare(bStart);
      });
      sortedSlots[date] = Object.fromEntries(slots);
    });

    setSlotsByDate(sortedSlots);
    setSortedDates(sortedDateKeys);
    setSalleNames(Array.from(salleSet).sort());
  }, [affectations, niveau]);

  return (
    <div className="w-full overflow-auto mb-10">
      <h2 className="text-xl font-bold text-center mb-4">
        Planning de Surveillance / 2AP - {niveau}
      </h2>
      <table className="min-w-full table-auto border border-gray-300 text-sm text-center bg-white shadow print:shadow-none print:text-xs print:border print:min-w-full">
        <thead>
          {/* First row: Date headers with colspan */}
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">Salles</th>
            {sortedDates.map((date) => (
              <th
                key={date}
                colSpan={Object.keys(slotsByDate[date]).length}
                className="border px-2 py-1"
              >
                {new Date(date).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </th>
            ))}
          </tr>
          {/* Second row: Time + Matière headers */}
          <tr className="bg-gray-100">
            <th className="border px-2 py-1"></th>
            {sortedDates.map((date) =>
              Object.keys(slotsByDate[date]).map((slotKey, idx) => (
                <th key={`${date}-${idx}`} className="border px-2 py-1">
                  {slotKey.split(" - ")[1]} <br />
                  <span className="text-xs text-gray-600">
                    {slotKey.split(" - ")[0]}
                  </span>
                </th>
              ))
            )}
          </tr>
        </thead>
        <tbody>
          {salleNames.map((salle) => (
            <tr key={salle}>
              <td className="border px-2 py-1 font-medium">{salle}</td>
              {sortedDates.map((date) =>
                Object.values(slotsByDate[date]).map((slot) => (
                  <td
                    key={`${salle}-${date}-${Math.random()}`}
                    className="border px-2 py-1"
                  >
                    {slot[salle] ? slot[salle].join(", ") : ""}
                  </td>
                ))
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Rslt = () => {
  const [affectations, setAffectations] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      await api.post("/affectations/generate");
      window.location.reload();
    } catch (error) {
      console.error("Erreur de génération :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api
      .get("/affectations")
      .then((res) => {
        console.log("Affectations:", res.data);
        setAffectations(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="rslt-container text-center print:block print:p-4 print:bg-white print:text-black">
      <button
        onClick={() => handleGenerate()}
        className="px-12 m-10 bg-blue-700 py-2 rounded cursor-pointer text-white print:hidden"
      >
        {loading ? "Génération en cours..." : "Générer"}
      </button>

      {affectations.length != 0 && (
        <>
          <h1 className="text-2xl font-bold text-center mb-8 print:text-lg">
            Planning de Surveillance - Année Universitaire 2024/2025
          </h1>
          <PlanningTable niveau={1} affectations={affectations} />
          <div className="hidden print:block print:page-break-after" />
          <PlanningTable niveau={2} affectations={affectations} />

          <button
            onClick={() => window.print()}
            className="px-12 m-10 bg-blue-700 py-2 rounded cursor-pointer text-white print:hidden"
          >
            Imprimer
          </button>
        </>
      )}
      {loading && <LoadingPulse />}
    </div>
  );
};

export default Rslt;
