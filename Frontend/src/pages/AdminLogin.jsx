import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            if (!email || !password) {
                setError('Veuillez entrer votre email et mot de passe.');
                return;
            }

            const response = await axios.post('http://localhost:8080/authAdmin/signin', { email, password });
            console.log('Connexion réussie:', response.data);
            navigate('/admin');
        } catch (error) {
            console.error('Échec de la connexion:', error.response ? error.response.data : error.message);
            setError('Email ou mot de passe invalide.');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-semibold text-center mb-4">Connexion</h2>
                <input
                    className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                
                <button
                    className="w-full bg-blue-500 text-white py-2 mt-1 rounded hover:bg-blue-600 transition"
                    onClick={handleLogin}
                >
                    Se connecter
                </button>

            </div>
        </div>
    );
}

export default AdminLogin;
