import React, { useEffect, useState } from "react";
import api from "../api/axios";

const ExamSchedule = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleDelete = async (idExamen) => {
    const confirmDelete = window.confirm("Voulez-vous vraiment supprimer cet examen ?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/examen/${idExamen}`);
      setExams(exams.filter((exam) => exam.idExamen !== idExamen));
    } catch (err) {
      alert("Erreur lors de la suppression");
    }
  };

  if (loading) return <p className="text-center text-gray-600">Chargement...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  const groupedExams = exams.reduce((acc, exam) => {
    const date = exam.jour;
    if (!acc[date]) acc[date] = [];
    acc[date].push(exam);
    return acc;
  }, {});

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">
        Planning des Examens
      </h1>

      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-center bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200 border border-gray-300">
              {Object.entries(groupedExams).map(([day, exams]) => (
                <th key={day} className="py-3 px-4 border" colSpan={exams.length}>
                  {new Date(day).toLocaleDateString("fr-FR", { weekday: "long" })} <br />
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
                  <td key={exam.idExamen} className="py-2 px-4 border">{exam.matiere.nomMatiere}</td>
                ))
              )}
            </tr>

            <tr className="border border-gray-300">
              {Object.entries(groupedExams).map(([day, exams]) =>
                exams.map((exam) => (
                  <td key={exam.idExamen} className="py-2 px-4 border text-red-600 font-bold">
                    {exam.matiere.chefDeModule.nom}
                  </td>
                ))
              )}
            </tr>

            {/* Ligne des boutons de suppression */}
            <tr className="border border-gray-300">
              {Object.entries(groupedExams).map(([day, exams]) =>
                exams.map((exam) => (
                  <td key={exam.idExamen} className="py-2 px-4 border">
                    <button
                      onClick={() => handleDelete(exam.idExamen)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Supprimer
                    </button>
                  </td>
                ))
              )}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Mode cartes sur mobile */}
      <div className="md:hidden">
        {Object.entries(groupedExams).map(([day, exams]) => (
          <div key={day} className="bg-white shadow-md rounded-lg mb-4 p-4">
            <h2 className="text-lg font-semibold text-center mb-2">
              {new Date(day).toLocaleDateString("fr-FR", { weekday: "long" })} - {day}
            </h2>
            {exams.map((exam) => (
              <div key={exam.idExamen} className="border-t py-2">
                <p className="text-sm text-gray-600">{exam.debut} - {exam.fin}</p>
                <p className="font-medium">{exam.matiere.nomMatiere}</p>
                <p className="text-red-600 font-bold">{exam.matiere.chefDeModule.nom}</p>
                <button
                  onClick={() => handleDelete(exam.idExamen)}
                  className="bg-red-500 text-white px-3 py-1 mt-2 rounded hover:bg-red-700 w-full"
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExamSchedule;
