import React from "react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

const MonHistorique = ({ historique }) => {
  // Regrouper par jour
  const groupedByDay = historique.reduce((acc, entry) => {
    const jour = entry.jour;
    if (!acc[jour]) acc[jour] = [];
    acc[jour].push(entry);
    return acc;
  }, {});

  // Trier chaque groupe par heure
  Object.keys(groupedByDay).forEach((day) => {
    groupedByDay[day].sort((a, b) => a.debut.localeCompare(b.debut));
  });

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
        Mon Historique de Surveillance
      </h2>

      {Object.entries(groupedByDay).map(([jour, surveillances]) => (
        <div key={jour} className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-2 border-b pb-1">
            {format(parseISO(jour), "EEEE dd MMMM yyyy", { locale: fr })}
          </h3>
          <ul className="space-y-3">
            {surveillances.map((entry) => (
              <li
                key={entry.id}
                className="bg-white shadow-md rounded-xl p-4 flex flex-col md:flex-row md:justify-between items-start md:items-center transition hover:shadow-lg"
              >
                <div>
                  <p className="font-medium text-lg text-gray-900">
                    {entry.debut.slice(0, 5)} → {entry.fin.slice(0, 5)} |{" "}
                    <span className="text-blue-600">{entry.nomMatiere}</span>
                  </p>
                  <p className="text-sm text-gray-600">Salle : {entry.salle}</p>
                </div>
                <div className="text-sm text-gray-500 mt-2 md:mt-0">
                  {entry.surveillant.nom} ({entry.surveillant.type})
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default MonHistorique;
