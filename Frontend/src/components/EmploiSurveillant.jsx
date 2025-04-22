import React from "react";
import AffectationCard from "./AffectationCard";

const EmploiSurveillant = ({ affectations }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {affectations.map((affectation) => (
        <AffectationCard key={affectation.idAffectation} affectation={affectation} />
      ))}
    </div>
  );
};

export default EmploiSurveillant;
