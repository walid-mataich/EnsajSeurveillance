import React from 'react'
import { useEffect, useState } from "react";
import api from '../api/axios';
import MultiSelectSurveillants from './MultiSelectSurveillants';

const Besoin = () => {

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
            console.log(survs.data);
            console.log(exs.data);

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
        
        //console.log("actifSurvs:", actifSurvs.length);
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
     <div className="p-4 m-50 bg-white rounded-xl shadow-md max-w-xl mx-auto mt-6">
    <label htmlFor="nbrDesurveillance" className="block text-gray-700 font-semibold mb-2">
      Nombre maximal de surveillances par surveillant :
    </label>
    <input
      type="number"
      id="nbrDesurveillance"
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      onChange={(e) => setNbSurveillance(e.target.value)}
      placeholder="Ex: 3"
    />

    {msg && (
      <p className={`mt-4 font-medium ${besoin ? "text-red-600" : "text-green-600"}`}>
        {msg}
      </p>
    )}

    {besoin && (
      <div className="mt-6">
        <h3 className="text-gray-800 font-semibold mb-2">Ajouter des surveillants :</h3>
        <MultiSelectSurveillants surveillants={surveillants.filter((s) => !s.actif)} />
      </div>
    )}
  </div>
    </>
  )
}

export default Besoin