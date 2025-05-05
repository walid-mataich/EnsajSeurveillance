import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound ,User, Mail, LogOut } from 'lucide-react';
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
        console.error("Erreur lors de la récupération de l'utilisateur connecté", error);
      }
    };
    
    fetchUserConnecter();
  }, []);

  function handleModifier() {
    if (isAdmin) {
      navigate("/admin/ModifierMp");
    } else {
      navigate("/Surv/ModifierMp");
    }
  }

  function handleLogout() {
    localStorage.removeItem("jwtTokenadmin");
    localStorage.removeItem("jwtTokensurv");
    navigate("/");
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container px-4 py-6 sm:px-6 lg:px-8">
    <div className="profile-container bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
    <div className="flex flex-row justify-between items-start md:items-center gap-4 mb-6">
  <h2 className="text-2xl font-semibold flex items-center gap-2">
    <User size={24} className="text-blue-500" />
    Profile
  </h2>

  <div className="flex flex-row gap-2 w-auto items-end">
    <button
      onClick={handleModifier}
      className="flex items-center justify-center w-10 md:w-[175px] h-[45px] text-sm px-2 py-2 form-submit-btn bg-blue-500 text-white rounded-md gap-2"
    >
       <KeyRound size={18} />
      <span className="hidden md:inline">Modifier mot de passe</span>
    </button>

    <button
      onClick={handleLogout}
      className="flex items-center justify-center w-10 md:w-[175px] h-[45px] text-sm px-2 py-2 logout-btn bg-red-500 text-white rounded-md gap-2"
    >
      <LogOut size={18} />
      <span className="hidden md:inline">Déconnexion</span>
    </button>
  </div>
</div>
  
      {/* Avatar */}
      <div className="profile-avatar flex flex-col items-center mb-6 text-center">
        <div className="bg-gradient-to-r from-blue-400 to-blue-600 w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl mb-3">
          {user.prenom?.charAt(0) || user.nom?.charAt(0)}
        </div>
        <h3 className="text-xl font-medium">{user.nom} {user.prenom} </h3>
        <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mt-2">
          {isAdmin ? "Administrateur" : "Surveillant"}
        </span>
      </div>
  
      {/* Infos générales */}
      <div className="user-info bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium mb-4 text-center md:text-left">Informations personnelles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label className="form-label flex items-center gap-2">
              <User size={18} />
              Nom
            </label>
            <p className="form-value">{user.nom}</p>
          </div>
  
          <div className="form-group">
            <label className="form-label flex items-center gap-2">
              <User size={18} />
              Prénom
            </label>
            <p className="form-value">{user.prenom}</p>
          </div>
  
          <div className="form-group">
            <label className="form-label flex items-center gap-2">
              <Mail size={18} />
              Email
            </label>
            <p className="form-value">{user.email}</p>
          </div>
  
          {!isAdmin && (
            <>
              <div className="form-group">
                <label className="form-label flex items-center gap-2">
                  Type de surveillant
                </label>
                <p className="form-value">{user.type}</p>
              </div>
  
              <div className="form-group">
                <label className="form-label flex items-center gap-2">
                  Nombre de surveillances
                </label>
                <p className="form-value">{user.nbrSurveillance}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  </div>
  
  );
}

export default Profile;
