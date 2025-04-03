import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../api/axios";

const Rslt = () => {
  const [affectations, setAffectations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/affectations/all");
        setAffectations(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  // Group exams by day and time slot
  const groupByDayAndTime = (affectations) => {
    const grouped = {};

    affectations.forEach((affectation) => {
      const day = affectation.examen.jour;
      const timeSlot = `${affectation.examen.debut}-${affectation.examen.fin}`;

      if (!grouped[day]) {
        grouped[day] = {};
      }

      if (!grouped[day][timeSlot]) {
        grouped[day][timeSlot] = {
          matiere: affectation.examen.matiere.nomMatiere,
          chefModule: affectation.examen.matiere.chefDeModule.nom,
          salles: {},
        };
      }

      grouped[day][timeSlot].salles[affectation.salle.nomSale] =
        affectation.surveillant.nom;
    });

    return grouped;
  };

  // Filter affectations by level if needed
  const filteredAffectations =
    selectedLevel === "all"
      ? affectations
      : affectations.filter(
          (a) => a.examen.matiere.niveau.toString() === selectedLevel
        );

  const groupedData = groupByDayAndTime(filteredAffectations);

  // Extract all days from the data
  const days = Object.keys(groupedData).sort();

  // Extract all time slots (assuming consistent time slots across days)
  const timeSlots =
    days.length > 0 ? Object.keys(groupedData[days[0]]).sort() : [];

  // Extract all salle names (B1, B2, etc.)
  const allSalles = Array.from(
    new Set(affectations.map((a) => a.salle.nomSale))
  ).sort((a, b) => parseInt(a.substring(1)) - parseInt(b.substring(1)));

  if (loading) {
    return <div className="loading">Loading planning data...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="planning-container">
      <h2>Planning de Surveillance des Examens</h2>

      <div className="level-filter">
        <label htmlFor="level-select">Filtrer par niveau : </label>
        <select
          id="level-select"
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
        >
          <option value="all">Tous les niveaux</option>
          <option value="1">Niveau 1</option>
          <option value="2">Niveau 2</option>
        </select>
      </div>

      <div className="table-responsive">
        <table className="planning-table">
          <thead>
            <tr>
              <th rowSpan="2">Salles</th>
              {days.map((day) => (
                <th key={day} colSpan={timeSlots.length}>
                  {new Date(day).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </th>
              ))}
            </tr>
            <tr>
              {days.flatMap((day) =>
                timeSlots.map((slot) => (
                  <th key={`${day}-${slot}`}>
                    {slot.split(":").slice(0, 2).join("h")}
                  </th>
                ))
              )}
            </tr>
            <tr>
              <th></th>
              {days.flatMap((day) =>
                timeSlots.map((slot) => (
                  <th key={`mat-${day}-${slot}`}>
                    {groupedData[day]?.[slot]?.matiere || "-"}
                  </th>
                ))
              )}
            </tr>
            <tr>
              <th></th>
              {days.flatMap((day) =>
                timeSlots.map((slot) => (
                  <th key={`prof-${day}-${slot}`}>
                    {groupedData[day]?.[slot]?.chefModule || "-"}
                  </th>
                ))
              )}
            </tr>
          </thead>
          <tbody>
            {allSalles.map((salle) => (
              <tr key={salle}>
                <td>{salle}</td>
                {days.flatMap((day) =>
                  timeSlots.map((slot) => (
                    <td key={`${salle}-${day}-${slot}`}>
                      {groupedData[day]?.[slot]?.salles[salle] || "-"}
                    </td>
                  ))
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .planning-container {
          padding: 20px;
          font-family: Arial, sans-serif;
        }

        .loading,
        .error {
          padding: 20px;
          text-align: center;
          font-size: 1.2em;
        }

        .error {
          color: #d32f2f;
        }

        .level-filter {
          margin-bottom: 20px;
        }

        .level-filter select {
          padding: 5px 10px;
          border-radius: 4px;
          border: 1px solid #ccc;
        }

        .table-responsive {
          overflow-x: auto;
          margin-top: 20px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .planning-table {
          width: 100%;
          border-collapse: collapse;
        }

        .planning-table th,
        .planning-table td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: center;
          min-width: 120px;
        }

        .planning-table th {
          background-color: #f2f2f2;
          position: sticky;
          top: 0;
          font-weight: bold;
        }

        .planning-table tr:nth-child(even) {
          background-color: #f9f9f9;
        }

        .planning-table tr:hover {
          background-color: #f1f1f1;
        }
      `}</style>
    </div>
  );
};

export default Rslt;
