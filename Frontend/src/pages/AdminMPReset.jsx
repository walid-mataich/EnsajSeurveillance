// src/pages/ResetPassword.jsx
import { useSearchParams,useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import api from "../api/axios";

export default function AdminResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token");
    const [redirect, setRedirect] = useState(false);   
    const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  

  const handleReset = async (e) => {
    e.preventDefault();
    
    if(password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      await api.post("/Admin/reset-password", { token, newPassword: password });
      setMessage("Mot de passe réinitialisé avec succès !");
      setRedirect(true);
      setError("");
    } catch (error) {
      setMessage("");
      setError("Erreur session expiré");
    }
  };
  useEffect(() => {
    if (redirect) {
      const timer = setTimeout(() => {
        navigate("/loginadmin");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [redirect, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md transition-all duration-300">
        <div className="p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Réinitialisation du mot de passe
            </h1>
            <p className="text-gray-500">Entrez votre nouveau mot de passe</p>
          </div>

          {!message ? (
            <form onSubmit={handleReset} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <input
                    type="password"
                    placeholder="Nouveau mot de passe"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    required
                  />
                </div>

                <div>
                  <input
                    type="password"
                    placeholder="Confirmer le mot de passe"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError("");
                    }}
                    required
                  />
                </div>

                {error && (
                  <div className="text-red-600 text-sm flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {error}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
              >
                Confirmer la réinitialisation
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Réinitialisation réussie !
              </h3>
              <p className="text-gray-600">
                Vous pouvez maintenant vous connecter avec votre nouveau mot de passe
              </p>
            </div>
          )}
        </div>
      </div>
      
    </div>

  );
}