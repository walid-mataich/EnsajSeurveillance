 import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

function Profile() {
  const [user, setUser] = useState(null);
  const isAdmin = !!localStorage.getItem("jwtTokenadmin");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserConnecter = async () => {
      try {
        const response = isAdmin
          ? await api.get("Admin/userConnecter")
          : await api.get("surveillants/userConnecter");

        setUser(response.data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de l'utilisateur connecté",
          error
        );
      }
    };
    
    fetchUserConnecter();
    console.log(user);
  }, []);
 function handleModifier(){
  if(isAdmin){
    navigate("/admin/ModifierMp");
  }else
  navigate("/Surv/ModifierMp");
 }

  return (
    <>
      {user && (
        <div className="max-w-md mx-auto mt-10 bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Profil Utilisateur
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">ID :</span>
              <span className="text-gray-900">{user.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Nom :</span>
              <span className="text-gray-900">{user.nom}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">prenom :</span>
              <span className="text-gray-900">{user.prenom}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Email :</span>
              <span className="text-gray-900">{user.email}</span>
            </div>
            {!isAdmin && (
              <>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Type Prof :</span>
                  <span className="text-gray-900">{user.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Nombre de surveillance :</span>
                  <span className="text-gray-900">{user.nbrSurveillance}</span>
                </div>
              </>
            )}
          </div>

          {/* Bouton pour modifier le mot de passe */}
          <div className="mt-6 text-center">
          <button
  className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow transition duration-300 mt-6 text-center"
onClick={handleModifier}
>
  Modifier le mot de passe
</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;
