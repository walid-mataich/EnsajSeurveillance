import React from "react";
import api from "../api/axios";
import { useEffect, useState } from "react";
import { label, li, p } from "framer-motion/client";
import MultiSelectSurveillants from "../components/MultiSelectSurveillants";

const SurveillantsManag = () => {
  const [surveillants, setSurveillants] = useState([]);
  const [exams, setExams] = useState([]);
  const [nbSurveillance, setNbSurveillance] = useState(0);
  const [besoin, setBesoin] = useState(false);

  const [msg, setMsg] = useState(``);

  useEffect(() => {
    const fetchSurv = async () => {
      try {
        const survs = await api.get("surveillants");
        const exs = await api.get("examen/all");
        setSurveillants(survs.data);
        setExams(exs.data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des surveillants et examens:",
          error
        );
      }
    };
    fetchSurv();
  }, []);

  useEffect(() => {
    const nbSalle = exams.reduce((acc, exam) => {
      return (
        acc +
        exam.salles.reduce((acc, salle) => {
          return acc + salle.nbrDeSurveillant;
        }, 0)
      );
    }, 0);
    console.log("nbSalle:", nbSalle);

    const actifSurvs = surveillants.filter((surv) => surv.actif === true);
    
    const calculNbSurv = Math.ceil(nbSalle / actifSurvs.length);
    console.log("calculNbSurv:", calculNbSurv);

    if (calculNbSurv > parseInt(nbSurveillance) ) {
      
      setMsg(`le nombre de surveillants est insuffisant, ajouter des surveillants`);
      setBesoin(true);
         
    }else{
      setMsg(`le nombre de surveillants est suffisant`);
      setBesoin(false);
    }


  }, [nbSurveillance]);

  return (
    <>
      <label htmlFor="nbrDesurveillance">
        {" "}
        entre le nombre maximal de surveillances par surveillants
      </label>
      <input
        type="text"
        className="border-1 mx-3 rounded p-1"
        onChange={(e) => setNbSurveillance(e.target.value)}
      />
      {besoin && (<><MultiSelectSurveillants surveillants={surveillants.filter((s)=> !s.actif)}/></>)}
    </>
  );
};

export default SurveillantsManag;
