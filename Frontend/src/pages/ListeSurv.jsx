import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function ListeSurv() {
  const [surveillants, setSurveillants] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [survActuel, setSurvActuel] = useState(null);
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [type, setType] = useState("");
  const navigate=useNavigate();

  useEffect(() => {
    chargerSurveillants();
  }, []);

  const chargerSurveillants = () => {
    api.get("surveillants")
      .then((res) => setSurveillants(res.data))
      .catch((err) => console.error("Erreur chargement :", err));
  };

  const ouvrirModification = (surv) => {
    setSurvActuel(surv);
    setNom(surv.nom);
    setPrenom(surv.prenom);
    setEmail(surv.email);
    setType(surv.type);
    setPassword("");
    setConfirmPassword("");
    setModalOpen(true);
  };
  function handleAjoutSurv(){
    navigate("/admin/ajoutSurv");
  }

  const supprimerSurveillant = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce surveillant ?")) {
      api.delete(`surveillants/supprimer/${id}`)
        .then(() => {
          chargerSurveillants();
        })
        .catch((err) => console.error("Erreur suppression :", err));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    const survModifie = { ...survActuel, nom, prenom, email, password, type };
    api.put(`surveillants/modifier/${survActuel.id}`, survModifie)
      .then(() => {
        setModalOpen(false);
        chargerSurveillants();
      })
      .catch((err) => console.error("Erreur modification :", err));
  };

  return (
    <div className="flex flex-col p-4 sm:p-6">
    <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">Liste des Surveillants</h2>
  
    <div className="overflow-x-auto rounded-md border border-gray-200">
      <table className="min-w-full text-sm bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left">Nom</th>
            <th className="px-4 py-3 text-left">Prénom</th>
            <th className="px-4 py-3 text-left">Email</th>
            <th className="px-4 py-3 text-left">Type</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {surveillants.map((s) => (
            <tr key={s.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-3">{s.nom}</td>
              <td className="px-4 py-3">{s.prenom}</td>
              <td className="px-4 py-3 break-words">{s.email}</td>
              <td className="px-4 py-3">{s.type}</td>
              <td className="px-4 py-3 text-center">
                <div className="flex flex-col items-center space-y-2 sm:flex-row sm:justify-center sm:space-x-2 sm:space-y-0">
                  <button
                    onClick={() => ouvrirModification(s)}
                    className="w-[100px] px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => supprimerSurveillant(s.id)}
                    className="w-[100px] px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  
    {modalOpen && (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] sm:w-full max-w-md animate-fade-in-up">
          <h2 className="text-xl font-bold text-center mb-4">Modifier un Surveillant</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: "Nom", value: nom, set: setNom, type: "text" },
              { label: "Prénom", value: prenom, set: setPrenom, type: "text" },
              { label: "Email", value: email, set: setEmail, type: "email" },
              { label: "Mot de passe", value: password, set: setPassword, type: "password" },
              { label: "Confirmer mot de passe", value: confirmPassword, set: setConfirmPassword, type: "password" },
            ].map((field, i) => (
              <label key={i} className="block text-sm font-medium text-gray-700">
                {field.label}
                <input
                  type={field.type}
                  value={field.value}
                  onChange={(e) => field.set(e.target.value)}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                  required={field.value !== password && field.value !== confirmPassword}
                />
              </label>
            ))}
  
            <div>
              <span className="text-sm font-medium text-gray-700 block mb-2">Type de surveillant</span>
              <div className="flex gap-3">
                {["Professeur", "Vacataire", "Doctorant"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setType(option)}
                    className={`px-3 py-2 text-xs rounded-lg border ${
                      type === option
                        ? "bg-blue-600 text-white"
                        : "bg-white border-gray-300 text-gray-700"
                    } hover:bg-blue-100`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
  
            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
  
    <div className="w-full flex justify-center mt-6">
      <button
        onClick={handleAjoutSurv}
        className="w-[200px] py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
      >
        Ajouter Surveillant
      </button>
    </div>
  </div>
  );
}

export default ListeSurv;
