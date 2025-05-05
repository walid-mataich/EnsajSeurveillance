
import { useState, useEffect } from "react";
import api from "../api/axios";
import LoadingPulse from "../components/LoadingPulse";
import LoginLoadin from '../components/LoginLoadin';

export default function MotpassOublier() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await api.post("/surveillants/forgot-password", { email });
            setMessage("Un e-mail de réinitialisation a été envoyé.");

        } catch (error) {
            setMessage("Erreur : " + (error.response?.data?.message || "inconnue."));
        }
    };
    useEffect(() => {
        if (loading) {
            setLoading(false);
        }
    }, [message]);

    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
                <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
                    <div className="text-center space-y-4">
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            Mot de passe oublié ?
                        </h1>

                        <p className="text-gray-600 mb-6">
                            Aucun problème. Indiquez-nous votre adresse e-mail et nous vous enverrons un lien de réinitialisation de mot de passe.
                        </p>

                        {!message ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <input
                                        type="email"
                                        placeholder="exemple@gmail.com"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
                                >
                                    ENVOYER LE LIEN DE RÉINITIALISATION
                                </button>
                                {loading &&<LoginLoadin/>}
                            </form>
                        ) : (
                            <div className="text-center space-y-4">
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <p className="text-gray-600">
                                    Nous avons envoyé votre lien de réinitialisation à<br />
                                    <span className="font-semibold text-blue-600">{email}</span>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
