import React, { useEffect, useState } from "react";
import api from "../api/axios";

const ExamSchedule = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editExam, setEditExam] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [salles, setSalles] = useState([]);
  const [sallesChoisies, setSallesChoisies] = useState([]);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await api.get("/examen/all");
        setExams(response.data);
      } catch (err) {
        setError("Échec du chargement des données");
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await api.get("/salles");
        setSalles(response.data);
      } catch (err) {
        console.log("Échec du chargement des données");
      }
    };
    fetchExams();
  }, []);

  const handleEdit = (exam) => {
    setEditExam({ ...exam });
    setModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      await api.put(
        `/examen/modifier?id=${editExam.idExamen}` +
          `${sallesChoisies.map((salle) => `&idSalle=${salle}`).join("")}`,
        {
          jour: editExam.jour,
          debut: editExam.debut,
          fin: editExam.fin,
          nbrDesSalles: editExam.salle,
        }
      );

      setExams((prev) =>
        prev.map((ex) =>
          ex.idExamen === editExam.idExamen ? { ...ex, ...editExam } : ex
        )
      );

      setModalOpen(false);
      setEditExam(null);
    } catch (err) {
      alert("Erreur lors de la mise à jour");
    }
  };

  if (loading)
    return <p className="text-center text-gray-600">Chargement...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  const examsByLevel = exams.reduce((acc, exam) => {
    const level = exam.matiere.niveau;
    if (!acc[level]) acc[level] = [];
    acc[level].push(exam);
    return acc;
  }, {});

  const renderScheduleForLevel = (level, exams) => {
    const groupedExams = exams.reduce((acc, exam) => {
      const date = exam.jour;
      if (!acc[date]) acc[date] = [];
      acc[date].push(exam);
      return acc;
    }, {});

    return (
      <div key={level} className="mb-8">
        <h2 className="text-xl font-bold text-center mb-4">
          Planning des Examens - 2AP - {level}
        </h2>

        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-center bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-200 border border-gray-300">
                {Object.entries(groupedExams).map(([day, exams]) => (
                  <th
                    key={day}
                    className="py-3 px-4 border"
                    colSpan={exams.length}
                  >
                    {new Date(day).toLocaleDateString("fr-FR", {
                      weekday: "long",
                    })}{" "}
                    <br />
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border border-gray-300">
                {Object.entries(groupedExams).map(([day, exams]) =>
                  exams.map((exam) => (
                    <td key={exam.idExamen} className="py-2 px-4 border">
                      {exam.debut} - {exam.fin}
                    </td>
                  ))
                )}
              </tr>

              <tr className="border border-gray-300">
                {Object.entries(groupedExams).map(([day, exams]) =>
                  exams.map((exam) => (
                    <td key={exam.idExamen} className="py-2 px-4 border">
                      {exam.matiere.nomMatiere}
                    </td>
                  ))
                )}
              </tr>

              <tr className="border border-gray-300">
                {Object.entries(groupedExams).map(([day, exams]) =>
                  exams.map((exam) => (
                    <td
                      key={exam.idExamen}
                      className="py-2 px-4 border text-red-600 font-bold"
                    >
                      {exam.matiere.chefDeModule.nom}
                    </td>
                  ))
                )}
              </tr>

              <tr className="border border-gray-300">
                {Object.entries(groupedExams).map(([day, exams]) =>
                  exams.map((exam) => (
                    <td key={exam.idExamen} className="py-2 px-4 border">
                      {exam.nbrDesSalles} salle(s)
                    </td>
                  ))
                )}
              </tr>

              <tr className="border border-gray-300">
                {Object.entries(groupedExams).map(([day, exams]) =>
                  exams.map((exam) => (
                    <td key={exam.idExamen} className="py-2 px-4 border">
                      <button
                        onClick={() => handleEdit(exam)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Modifier
                      </button>
                    </td>
                  ))
                )}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="md:hidden">
          {Object.entries(groupedExams).map(([day, exams]) => (
            <div key={day} className="bg-white shadow-md rounded-lg mb-4 p-4">
              <h2 className="text-lg font-semibold text-center mb-2">
                {new Date(day).toLocaleDateString("fr-FR", {
                  weekday: "long",
                })}{" "}
                - {day}
              </h2>
              {exams.map((exam) => (
                <div key={exam.idExamen} className="border-t py-2">
                  <p className="text-sm text-gray-600">
                    {exam.debut} - {exam.fin}
                  </p>
                  <p className="font-medium">{exam.matiere.nomMatiere}</p>
                  <p className="text-red-600 font-bold">
                    {exam.matiere.chefDeModule.nom}
                  </p>
                  <p className="text-gray-700">{exam.nbrDesSalles} salle(s)</p>
                  <button
                    onClick={() => handleEdit(exam)}
                    className="bg-blue-500 text-white px-3 py-1 mt-2 rounded hover:bg-blue-700 w-full"
                  >
                    Modifier
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">
        Planning des Examens
      </h1>

      {Object.entries(examsByLevel).map(([level, exams]) =>
        renderScheduleForLevel(level, exams)
      )}

      {modalOpen && editExam && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-lg font-bold mb-4 text-center">
              Modifier l'examen
            </h2>

            <label className="block mb-2">
              Jour:
              <input
                type="date"
                className="w-full border px-2 py-1 rounded"
                value={editExam.jour}
                onChange={(e) =>
                  setEditExam({ ...editExam, jour: e.target.value })
                }
              />
            </label>

            <label className="block mb-2">
              Début:
              <input
                type="time"
                className="w-full border px-2 py-1 rounded"
                value={editExam.debut}
                onChange={(e) =>
                  setEditExam({ ...editExam, debut: e.target.value })
                }
              />
            </label>

            <label className="block mb-2">
              Fin:
              <input
                type="time"
                className="w-full border px-2 py-1 rounded"
                value={editExam.fin}
                onChange={(e) =>
                  setEditExam({ ...editExam, fin: e.target.value })
                }
              />
            </label>

            <label className="block mb-4">
              nbr Salle:
              <input
                type="text"
                className="w-full border px-2 py-1 rounded"
                value={editExam.salle}
                onChange={(e) =>
                  setEditExam({ ...editExam, salle: e.target.value })
                }
              />
            </label>
            <span className="text-lg font-medium text-gray-700">
              les salles
            </span>
            {salles.map((salle) => (
              <label key={salle.idSalle} className="flex items-center  gap-2">
                <input
                  type="checkbox"
                  value={salle.idSalle}
                  className="w-4 h-4"
                  onChange={(e) => {
                    const { value, checked } = e.target;
                    setSallesChoisies((prev) =>
                      checked
                        ? [...prev, value]
                        : prev.filter((id) => id !== value)
                    );
                  }}
                  // à ajouter si tu veux gérer les salles sélectionnées
                />
                {salle.nomSale}
              </label>
            ))}

            <div className="flex justify-between">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setModalOpen(false)}
              >
                Annuler
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleUpdate}
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamSchedule;
