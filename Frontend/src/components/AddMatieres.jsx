import { React, useState } from "react";

const AddMatieres = () => {
  const [chefs, setChefs] = useState([]);
  const [nomMatiere, setNomMatiere] = useState("");
  const [niveau, setNiveau] = useState("");

  return (
    <div className="space-y-6 p-6 bg-white shadow-md rounded-lg max-w-md mx-auto mt-10">
      {/* Nom de la Matière */}
      <div>
        <label htmlFor="nom" className="block text-gray-700 font-medium mb-2">
          Nom de la Matière
        </label>
        <input
          type="text"
          id="nom"
          name="nom"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Entrez le nom de la matière"
        />
      </div>

      {/* Niveau */}
      <div>
      <label htmlFor="niveau" className="block text-gray-700 font-medium mb-2">
          Niveau
        </label>
       <select
          id="chef"
          name="chef"
          className="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Sélectionnez un niveau</option>
          <option value="1">2AP-1</option>
          <option value="2">2AP-2</option>
          
        </select>
      </div>

      {/* Chef de Matière */}
      <div>
        <label htmlFor="chef" className="block text-gray-700 font-medium mb-2">
          Chef de Matière
        </label>
        <select
          id="chef"
          name="chef"
          className="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Sélectionnez un chef</option>
          <option value="1">Professeur Dupont</option>
          <option value="2">Professeur Martin</option>
          <option value="3">Professeur Bernard</option>
        </select>
      </div>

      {/* Submit Button */}
      <div className="text-center">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full shadow-md transition transform hover:scale-105"
        >
          Enregistrer
        </button>
      </div>
    </div>
  );
};

export default AddMatieres;
