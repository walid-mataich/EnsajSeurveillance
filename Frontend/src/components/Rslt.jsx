import React, { useEffect, useState } from "react";
import api from "../api/axios";
import LoadingPulse from "./LoadingPulse";
import { a } from "framer-motion/client";
import SubmissionStatus from "./SubmissionStatus";
import { useNavigate } from "react-router-dom";

const PlanningTable = ({ niveau, affectations, onCellClick }) => {
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
        temp[date][slotKey][a.salle.nomSale] = {
          surveillants: [],
          affectations: [],
        };
      }
      temp[date][slotKey][a.salle.nomSale].surveillants.push(a.surveillant.nom);
      temp[date][slotKey][a.salle.nomSale].affectations.push(a.idAffectation);
    });

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
                Object.values(slotsByDate[date]).map((slot, idx) => (
                  <td
                    key={`${salle}-${date}-${idx}`}
                    className="border px-2 py-1 cursor-pointer hover:bg-blue-100"
                    onClick={() => {
                      if (slot[salle]) {
                        onCellClick(slot[salle]);
                      }
                    }}
                  >
                    {slot[salle] ? slot[salle].surveillants.join(", ") : ""}
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
  const [newSurvs, setNewSurvs] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [updatedSurvs, setUpdatedSurvs] = useState([]);
  const [loadingHistorique, setLoadingHistorique] = useState(false);
  const [successHistorique, setSuccessHistorique] = useState(false);

  useEffect(() => {
    try {
      api.get("/choix").then((res) => {
        console.log(res.data);
      });
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    try {
      api.get("/surveillants").then((res) => {
        setNewSurvs(res.data);
      });
    } catch (error) {
      console.error("Erreur de récupération des surveillants :", error);
    }
  }, []);

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

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete("/affectations/deleteAll");
      window.location.reload();
    } catch (error) {
      console.error("Erreur de suppression :", error);
    } finally {
      setLoading(false);
    }
  };

  const handleHistorique = async () => {
    setLoadingHistorique(true);
    setSuccessHistorique(false);
    try {
      await api.post("/affectations/historiqueSave");
      setSuccessHistorique(true);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'historique :", error);
    } finally {
      setLoadingHistorique(false);
    }
  };

  const handleUpdate = async (idAff, idNewSurv) => {
    setLoading(true);
    try {
      await api.put(`/affectations/modifier/${idAff}/${idNewSurv}`);
    } catch (error) {
      console.error("Erreur de mise à jour :", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    for (let i = 0; i < selectedCell.affectations.length; i++) {
      await handleUpdate(selectedCell.affectations[i], updatedSurvs[i]);
    }
    window.location.reload();
  };

  useEffect(() => {
    api
      .get("/affectations")
      .then((res) => {
        setAffectations(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const navigate = useNavigate();

  return (
    <div className="rslt-container text-center print:block print:p-4 print:bg-white print:text-black">
      {affectations.length === 0 && <SubmissionStatus />}
      {affectations.length === 0 && (
        <button
          className="px-12 m-10 border-2 text-blue-700 border-blue-700 py-2 rounded cursor-pointer  print:hidden"
          onClick={() => navigate("/admin/verifAff")}
        >
          Analiser
        </button>
      )}
      <button
        onClick={() => {
          affectations.length === 0 ? handleGenerate() : handleDelete();
        }}
        className="px-12 m-10 bg-blue-700 py-2 rounded cursor-pointer text-white print:hidden"
      >
        {affectations.length === 0
          ? loading
            ? "Génération en cours..."
            : "Générer les affectations"
          : "Réinitialiser"}
      </button>
      {affectations.length !== 0 && (
        <button
          className="px-12 m-10 bg-blue-700 py-2 rounded cursor-pointer text-white print:hidden"
          onClick={handleHistorique}
          disabled={loadingHistorique}
        >
          {loadingHistorique
            ? "Enregistrement..."
            : "Valider (enregistrer dans l'historique)"}
        </button>
      )}

      {affectations.length !== 0 && (
        <>
          <h1 className="text-2xl font-bold text-center mb-8 print:text-lg">
            Planning de Surveillance - Année Universitaire 2024/2025
          </h1>
          <PlanningTable
            niveau={1}
            affectations={affectations}
            onCellClick={(cellData) => {
              setSelectedCell(cellData);
              setUpdatedSurvs(cellData.surveillants.map(() => ""));
            }}
          />
          <div className="hidden print:block print:page-break-after" />
          <PlanningTable
            niveau={2}
            affectations={affectations}
            onCellClick={(cellData) => {
              setSelectedCell(cellData);
              setUpdatedSurvs(cellData.surveillants.map(() => ""));
            }}
          />
          <button
            onClick={() => window.print()}
            className="px-12 m-10 bg-blue-700 py-2 rounded cursor-pointer text-white print:hidden"
          >
            Imprimer
          </button>
        </>
      )}
      {loading && <LoadingPulse />}

      {selectedCell && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-white border rounded-lg shadow-lg p-8 w-96 z-50">
          <h2 className="text-xl font-bold mb-4">Modifier Surveillants</h2>
          {selectedCell.surveillants.map((oldSurv, idx) => (
            <div key={idx} className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {oldSurv}
              </label>
              <select
                value={updatedSurvs[idx]}
                onChange={(e) => {
                  const newUpdatedSurvs = [...updatedSurvs];
                  newUpdatedSurvs[idx] = e.target.value;
                  setUpdatedSurvs(newUpdatedSurvs);
                }}
                className="w-full border rounded p-2"
              >
                <option value="">Choisir un surveillant</option>
                {newSurvs.map((surv) => (
                  <option key={surv.id} value={surv.id}>
                    {surv.nom}
                  </option>
                ))}
              </select>
            </div>
          ))}
          <div className="flex justify-between">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleSaveChanges}
            >
              Sauvegarder
            </button>
            <button
              className="bg-gray-400 text-white px-4 py-2 rounded"
              onClick={() => setSelectedCell(null)}
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rslt;
