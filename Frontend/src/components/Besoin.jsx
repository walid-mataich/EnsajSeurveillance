import React from "react";
import { useEffect, useState } from "react";
import api from "../api/axios";
import MultiSelectSurveillants from "./MultiSelectSurveillants";
import { AlertCircle, CheckCircle, PlusCircle } from "lucide-react";

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
    if (!nbSurveillance || parseInt(nbSurveillance) <= 0) {
      setMsg("");
      setBesoin(false);
      return;
    }
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

    if (calculNbSurv > parseInt(nbSurveillance)) {
      setMsg(
        `le nombre de surveillants est insuffisant, ajouter des surveillants`
      );
      setBesoin(true);
    } else {
      setMsg(`le nombre de surveillants est suffisant`);
      setBesoin(false);
    }
  }, [nbSurveillance]);

  return (
    <>
      <div className="p-6 bg-white rounded-2xl shadow-xl max-w-2xl mx-auto mt-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-blue-600 mb-4 flex items-center gap-2">
          <PlusCircle className="text-blue-500" size={28} />
          Gestion des Besoins en Surveillants
        </h2>

        <label
          htmlFor="nbrDesurveillance"
          className="block text-gray-700 font-medium mb-2"
        >
          Nombre maximal de surveillances par surveillant :
        </label>
        <input
          type="number"
          id="nbrDesurveillance"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          onChange={(e) => setNbSurveillance(e.target.value)}
          placeholder="Ex : 3"
        />

        {msg && (
          <div
            className={`mt-5 px-4 py-3 rounded-lg flex items-center gap-2 ${
              besoin ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
            }`}
          >
            {besoin ? <AlertCircle size={22} /> : <CheckCircle size={22} />}
            <p className="font-semibold">{msg}</p>
          </div>
        )}

        {besoin && (
          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <PlusCircle className="text-gray-700" size={22} />
              Ajouter des surveillants inactifs :
            </h3>
            <MultiSelectSurveillants
              surveillants={surveillants.filter((s) => !s.actif)}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Besoin;
