import { useState } from "react";
import api from "../api/axios";

const SurveillantsManag = () => {
  const [email, setEmail] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const [ajouter,setAjouter]=useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas.");
      return;
    }
    if (type===""){
      setMessage("Tu dois choisir le type de surveillant")
      return;
    }

    const newSurveillant = {
      email,
      nom,
      prenom,
      password,
      type,
    };

    try {
      await api.post("/surveillants/add", newSurveillant);
      setMessage("Surveillant ajouté avec succès !");
      setAjouter(true);
      setEmail("");
      setNom("");
      setPrenom("");
      setPassword("");
      setConfirmPassword("");
      setType("");
    } catch (error) {
      console.error(error);
      setMessage("Erreur lors de l'ajout du surveillant.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-xl rounded-xl mt-12">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Ajouter un Surveillant
      </h2>
      {message && <p className={`text-center ${ajouter?"text-green-600":"text-red-600"} font-medium`}>{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Nom
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
            className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
          />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          prenom
          <input
            type="text"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            required
            className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
          />
        </label>

        <label className="block text-sm font-medium text-gray-700">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
          />
        </label>


        <label className="block text-sm font-medium text-gray-700">
          Mot de passe
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
          />
        </label>

        <label className="block text-sm font-medium text-gray-700">
          Confirmer mot de passe
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
          />
        </label>

        <div>
          <span className="text-sm font-medium text-gray-700 block mb-2">
            Type de surveillant
          </span>
          <div className="flex gap-3">
            {["Professeur", "Vacataire", "Doctorant"].map((option) => (
              <button
                type="button"
                key={option}
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

        <button
          type="submit"
          className="w-full py-2 text-lg font-medium text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition duration-300"
        >
          Ajouter Surveillant
        </button>
      </form>
    </div>
  );
};

export default SurveillantsManag;
