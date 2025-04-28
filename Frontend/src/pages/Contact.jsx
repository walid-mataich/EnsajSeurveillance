import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import api from "../api/axios";
const Contact = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await api.post("/Contact",formData);
      
      setSuccessMessage('Message envoyé avec succès !');
      setFormData({ nom: '', email: '', message: '' });
    } catch (error) {
      setErrorMessage('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
     <Navbar/>
    <div className="min-h-screen bg-blue-800 py-12 px-4 sm:px-6 lg:px-8">
      <section className="bg-white p-8 rounded-2xl shadow-md max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-8">
          Contactez-nous
        </h2>
        
        <p className="text-gray-600 text-center mb-6">
          Vous avez une question, une suggestion ou un problème technique ?<br />
          N'hésitez pas à nous contacter !
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              name="nom"
              placeholder="Votre nom"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.nom}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Votre email"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <textarea
              name="message"
              placeholder="Votre message"
              className="w-full border border-gray-300 p-3 rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors duration-200 font-medium disabled:opacity-50"
          >
            {loading ? 'Envoi en cours...' : 'Envoyer'}
          </button>

          {successMessage && (
            <p className="text-green-600 text-center mt-4">{successMessage}</p>
          )}

          {errorMessage && (
            <p className="text-red-600 text-center mt-4">{errorMessage}</p>
          )}
        </form>
      </section>
    </div>
    </>
  );
};

export default Contact;
