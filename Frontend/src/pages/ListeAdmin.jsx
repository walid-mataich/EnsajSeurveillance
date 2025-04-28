    import React, { useEffect, useState } from "react";
    import api from "../api/axios";
    import { useNavigate } from 'react-router-dom';
    const ListeAdmin = () => {
    const [admins, setAdmins] = useState([]);
    const [adminActuel, setAdminActuel] = useState(null);
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        chargerAdmins();
    }, []);
    const handleAjoutAdmin= ()=>{
        navigate("/admin/ajouterAdmin");
    }

    const chargerAdmins = () => {
        api.get("Admin/all")
        .then((response) => {
            setAdmins(response.data);
        })
        .catch((error) => {
            console.error("Erreur lors du chargement des admins :", error);
        });
    };

    const ouvrirFormulaireModification = (admin) => {
        setAdminActuel(admin);
        setNom(admin.nom);
        setPrenom(admin.prenom);
        setEmail(admin.email);
        setPassword("");
        setConfirmPassword("");
        setModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
        alert("Les mots de passe ne correspondent pas");
        return;
        }

        const adminModifie = {
        ...adminActuel,
        nom,
        prenom,
        email,
        password,
        };

        api
        .put(`Admin/modifier/${adminActuel.id}`, adminModifie)
        .then(() => {
            setModalOpen(false);
            setAdminActuel(null);
            chargerAdmins();
        })
        .catch((error) => {
            console.error("Erreur lors de la modification de l'admin :", error);
        });
    };

    const handleDelete = (adminId) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet administrateur ?")) {
        api
            .delete(`Admin/supprimer/${adminId}`)
            .then(() => {
            chargerAdmins();
            })
            .catch((error) => {
            console.error("Erreur lors de la suppression de l'admin :", error);
            });
        }
    };

    return (
        <div className=" flex flex-col p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Liste des Administrateurs</h2>
        <table className="min-w-full border border-gray-200 rounded overflow-hidden">
            <thead className="bg-gray-100">
            <tr>
                <th className="px-6 py-3 text-left">Nom</th>
                <th className="px-6 py-3 text-left">Prénom</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3">Actions</th>
            </tr>
            </thead>
            <tbody>
            {admins.map((admin) => (
                <tr key={admin.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">{admin.nom}</td>
                <td className="px-6 py-4">{admin.prenom}</td>
                <td className="px-6 py-4">{admin.email}</td>
                <td className="px-6 py-4 text-center">
                    <button
                    onClick={() => ouvrirFormulaireModification(admin)}
                    className="ml-4 px-3 py-1.5 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors"
                    >
                    Modifier
                    </button>
                    <button
                    onClick={() => handleDelete(admin.id)}
                    className="ml-4 px-3 py-1.5 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
                    >
                    Supprimer
                    </button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>

        {modalOpen && adminActuel && (
            <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md animate-fade-in-up">
                <h2 className="text-xl font-bold text-center mb-4">
                Modifier un Administrateur
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Nom"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                    type="text"
                    placeholder="Prénom"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                    type="password"
                    placeholder="Confirmer mot de passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <div className="flex justify-between mt-4">
                    <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                    >
                    Annuler
                    </button>
                    <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                    Enregistrer
                    </button>
                </div>
                </form>
            </div>
            </div>
        )}
        <button className="w-[200px] self-center mt-[20px] py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm" onClick={handleAjoutAdmin}>Ajouter Administrateur</button>
        </div>
    );
    };

    export default ListeAdmin;
