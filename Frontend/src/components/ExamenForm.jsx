import { useState, useEffect } from "react";
import api from "../api/axios"; // Importing your Axios config

const ExamenForm = () => {
  const [matiereId, setMatiereId] = useState("");
  const [jour, setJour] = useState("");
  const [debut, setDebut] = useState("");
  const [fin, setFin] = useState("");
  const [nbrDesSalles, setNbrDesSalles] = useState(""); // Nouvel état
  const [matieres, setMatieres] = useState([]);
  const [message, setMessage] = useState("");
  const [salles, setSalles] = useState([]);
  const [sallesChoisies, setSallesChoisies] = useState([]);

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

  useEffect(() => {
    api
      .get("/matieres")
      .then((response) => setMatieres(response.data))
      .catch((error) =>
        console.error("Erreur de chargement des matières", error)
      );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newExamen = { jour, debut, fin, nbrDesSalles }; // Inclure nbrDesSalles

    try {
      await api.post(
        `/examen/examSalle?matiereId=${matiereId}` +
          `${sallesChoisies.map((salle) => `&idSalles=${salle}`).join("")}`,
        newExamen,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setMessage("Examen ajouté avec succès !");
      setJour("");
      setDebut("");
      setFin("");
      setNbrDesSalles(""); // Réinitialiser
      setMatiereId("");
    } catch (error) {
      setMessage("Erreur lors de l'ajout de l'examen.");
      console.error(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-2xl rounded-xl mt-12">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
        Ajouter un Examen
      </h2>
      {message && (
        <p className="text-center text-green-600 font-medium">{message}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <label className="block">
          <span className="text-lg font-medium text-gray-700">Jour</span>
          <input
            type="date"
            value={jour}
            onChange={(e) => setJour(e.target.value)}
            required
            className="mt-2 block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          />
        </label>

        <div className="grid grid-cols-2 gap-6">
          <label className="block">
            <span className="text-lg font-medium text-gray-700">
              Heure de début
            </span>
            <input
              type="time"
              value={debut}
              onChange={(e) => setDebut(e.target.value)}
              required
              className="mt-2 block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
          </label>

          <label className="block">
            <span className="text-lg font-medium text-gray-700">
              Heure de fin
            </span>
            <input
              type="time"
              value={fin}
              onChange={(e) => setFin(e.target.value)}
              required
              className="mt-2 block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-lg font-medium text-gray-700">Matière</span>
          <select
            value={matiereId}
            onChange={(e) => setMatiereId(e.target.value)}
            required
            className="mt-2 block w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          >
            <option value="">Sélectionner une matière</option>
            {matieres.map((matiere) => (
              <option key={matiere.idMatiere} value={matiere.idMatiere}>
                {matiere.nomMatiere}
              </option>
            ))}
          </select>
        </label>

        {/* Ajout du champ "Nombre de Salles" */}
        <label className="block">
          <span className="text-lg font-medium text-gray-700">
            Nombre de Salles
          </span>
          <input
            type="number"
            value={nbrDesSalles}
            onChange={(e) => setNbrDesSalles(e.target.value)}
            required
            min="1"
            className="mt-2 block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          />
        </label>

        <div>
          <span className="text-lg font-medium text-gray-700">les salles</span>
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
        </div>

        <button
          type="submit"
          className="w-full py-3 text-lg font-medium text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition duration-300"
        >
          Ajouter Examen
        </button>
      </form>
    </div>
  );
};

export default ExamenForm;
