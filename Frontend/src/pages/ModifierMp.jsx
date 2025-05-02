


import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

function ModifierMp() {
  const isAdmin = !!localStorage.getItem("jwtTokenadmin");
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handlePasswordChange = async () => {
    setError('');
    setSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Tous les champs sont obligatoires.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if(!isAdmin){
    try {
      const response = await api.post('/surveillants/modifierMotDePasse', {
        currentPassword,
        newPassword,
      });

      setSuccess('Mot de passe modifié avec succès.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setTimeout(() => navigate('/surv'), 2000); // Redirection après succès
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Erreur lors de la modification du mot de passe."
      );
    }}
    else{
        try {
            const response = await api.post('/Admin/modifierMotDePasse', {
              currentPassword,
              newPassword,
            });
      
            setSuccess('Mot de passe modifié avec succès.');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
      
            setTimeout(() => navigate('/admin'), 2000); // Redirection après succès
          } catch (err) {
            console.error(err);
            setError(
              err.response?.data?.message || "Erreur lors de la modification du mot de passe."
            );
          } 
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 bg-gray-100">
  <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md w-full max-w-md">
    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
      Modifier le mot de passe
    </h2>

    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
    {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

    <div className="mb-4">
      <label className="block text-gray-700 mb-2">Mot de passe actuel</label>
      <input
        type="password"
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        placeholder="Entrez votre mot de passe actuel"
      />
    </div>

    <div className="mb-4">
      <label className="block text-gray-700 mb-2">Nouveau mot de passe</label>
      <input
        type="password"
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="Entrez un nouveau mot de passe"
      />
    </div>

    <div className="mb-6">
      <label className="block text-gray-700 mb-2">Confirmer le nouveau mot de passe</label>
      <input
        type="password"
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirmez votre nouveau mot de passe"
      />
    </div>

    <button
      onClick={handlePasswordChange}
      className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
    >
      Modifier le mot de passe
    </button>
  </div>
</div>
  );
}

export default ModifierMp;
