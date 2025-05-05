import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import api from './../api/axios';
import LoginLoadin from '../components/LoginLoadin';

function SurvLogin() {
    useEffect(()=>{localStorage.clear();},[]);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
   

    const handleLogin = async () => {
        try {
            if (!email || !password) {
                setError('Veuillez entrer votre email et mot de passe.');
                return;
            }
            setLoading(true);
            // Changer l'URL pour l'authentification surveillant
            const response1 = await api.post('/surveillants/signin', { email, password });
            console.log('Connexion réussie');
            localStorage.setItem("jwtTokensurv", response1.data.jwt);
             try {
                    const response = await api.get("surveillants/userConnecter");
                    if(response.data.firstEntry  )
                        {
                            setLoading(false);
                            console.log(localStorage.getItem("jwtTokensurv"));
                            navigate('/surv/ModifierMp');
                        }else{ 
                            setLoading(false);
                            console.log(localStorage.getItem("jwtTokensurv"));
                            navigate('/surv/dashboard');
                    }   
                        
                  } catch (error) {
                    console.error(
                      "Erreur lors de la récupération de l'utilisateur connecté",
                      error
                    );
                    setLoading(false);
                }
        } catch (error) {
            console.error('Échec de la connexion:', error.response ? error.response.data : error.message);
            setError('Email ou mot de passe invalide.');
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center flex-col items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                {/* Titre de la page */}
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Espace Surveillant</h2>
                <p className="text-center text-gray-500 mb-6">Veuillez vous connecter pour accéder à votre tableau de bord.</p>
                
                {/* Champ Email */}
                <input
                    className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                
                {/* Champ Mot de passe */}
                <input
                    className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <a href="/survOublier" className='text-red-500' >Mot de passe oublié?</a>
                
                {/* Message d'erreur */}
                {error && <p className="text-red-700 text-sm mb-4">{error}</p>}

                
                {/* Bouton de connexion */}
                <button
                    className="w-full bg-blue-500 text-white py-2 mt-2 rounded-lg hover:bg-blue-600 transition duration-300"
                    onClick={handleLogin}
                >
                    Se connecter
                </button>
            </div>
            {loading && <LoginLoadin/>}
        </div>
    );
}

export default SurvLogin;
