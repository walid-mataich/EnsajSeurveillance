import React from "react";
import { CalendarDays, Clock, MapPin, BookOpen } from "lucide-react";

const AffectationCard = ({ affectation }) => {
  const { examen, salle } = affectation;
  const { jour, debut, fin, matiere } = examen;
  const date = new Date(jour);

  return (
    <div className="rounded-2xl shadow-lg p-4 bg-white border hover:shadow-xl transition duration-300">
      <div className="flex items-center gap-2 text-sky-600 font-semibold mb-2">
        <CalendarDays className="w-5 h-5" />
        {date.toLocaleDateString()}
      </div>

      <div className="flex items-center gap-2 text-gray-700 mb-2">
        <Clock className="w-5 h-5 text-emerald-500" />
        {debut} - {fin}
      </div>

      <div className="flex items-center gap-2 text-gray-700 mb-2">
        <BookOpen className="w-5 h-5 text-indigo-500" />
        <span>{matiere.nomMatiere} (Niv {matiere.niveau})</span>
      </div>

      <div className="flex items-center gap-2 text-gray-700 mb-2">
        <MapPin className="w-5 h-5 text-rose-500" />
        <span>{salle.nomSale} {salle.type && `- ${salle.type}`}</span>
      </div>

      <div className="text-sm text-gray-500 italic mt-2">
        Chef de module : {matiere.chefDeModule.nom}
      </div>
    </div>
  );
};

export default AffectationCard;
