import React, { useState, useEffect } from 'react';
import api from "../api/axios";

const Notification = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupération des messages
  const fetchMessages = async () => {
    try {
      const response = await api.get('/Contact');
      const data = await response.data;
      setMessages(data);
    } catch (err) {
        setError(err.message);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Suppression d'un message
  const handleDelete = async (id) => {
      if (window.confirm("Voulez-vous vraiment supprimer ce message ?")) {
      try {
      const response = await api.delete(`/Contact/supprimer/${id}`);
      
      fetchMessages();
    } catch (err) {
      console.error('Erreur de suppression:', err);
    }}
  };

  // Suppression de tous les messages
  const handleDeleteAll = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer tous les messages ?')) {
      try {
        const response = await api.delete(`/Contact`); ;
        
        fetchMessages();
      } catch (err) {
        console.error('Erreur de suppression:', err);
      }
    }
  };

  if (isLoading) return <div className="text-center py-8">Chargement...</div>;
  if (error) return <div className="text-red-500 text-center py-8">Erreur: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Messages de contact</h1>
      
      <div className="space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2 flex-1">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-semibold text-blue-600">{message.nom}</h3>
                  <span className="text-sm text-gray-500">{message.email}</span>
                </div>
                <p className="text-gray-700">{message.message}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(message.dateEnvoi).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              
              <button
                onClick={() => handleDelete(message.id)}
                className="ml-4 px-3 py-1.5 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {messages.length > 0 && (
        <div className="mt-8 text-center">
          <button
            onClick={handleDeleteAll}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-sm"
          >
            Supprimer tous les messages
          </button>
        </div>
      )}
    </div>
  );
};

export default Notification;