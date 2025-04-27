import React from "react";
import Navbar from "../components/Navbar";
const About = () => {
    return (
        <div className="min-h-screen bg-gray-50">
           <Navbar/>

            {/* Contenu principal */}
            <main className="container mx-auto px-4 py-8">
                {/* Section Qui sommes-nous */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold text-blue-900 mb-6">Qui sommes-nous ?</h2>
                    <p className="text-gray-700 mb-6">
                        SurvEnsaj est une plateforme dédiée à l'automatisation de la gestion des surveillances d'examens au sein de l'ENSAJ.
                        Elle vise à simplifier l'organisation, la planification et le suivi des missions de surveillance pour les enseignants.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Objectifs */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold text-blue-900 mb-4">Nos Objectifs</h3>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                <li>Gagner du temps dans l'organisation des examens</li>
                                <li>Garantir la transparence des plannings</li>
                                <li>Offrir un outil moderne et sécurisé</li>
                            </ul>
                        </div>

                        {/* Fonctionnalités */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold text-blue-900 mb-4">Fonctionnalités clés</h3>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-medium text-blue-800">Espace Surveillant</h4>
                                    <p className="text-gray-700">Saisie des disponibilités et consultation des plannings</p>
                                </div>
                                <div>
                                    <h4 className="font-medium text-blue-800">Espace Administrateur</h4>
                                    <p className="text-gray-700">Création et gestion des plannings d'examens</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Présentation ENSAJ */}
                <section className="prose max-w-none mb-12">
                    <h2 className="text-3xl font-bold text-blue-900 mb-6">L'ENSAJ</h2>

                    <div className="text-gray-700 space-y-4">
                        <p>
                            L'École Nationale des Sciences Appliquées d'El Jadida (ENSAJ) est un établissement public
                            ayant pour vocation la formation d'ingénieurs d'État, la formation continue et la recherche
                            scientifique. Sa création au sein de l'Université Chouaïb Doukkali s'inscrit dans une stratégie
                            visant à :
                        </p>

                        <ul className="list-disc pl-6 space-y-2">
                            <li>Diversifier les formations selon les exigences du marché de l'emploi</li>
                            <li>Renforcer le système de passerelles pour la réorientation étudiante</li>
                            <li>Intensifier les interactions avec les opérateurs socioéconomiques</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-blue-900 mt-6">Structure de Formation</h3>
                        <p>
                            La formation à l'ENSAJ combine enseignements théoriques et activités pratiques organisés en
                            modules semestriels, comprenant :
                        </p>

                        <ul className="list-disc pl-6 space-y-2">
                            <li>Cours magistraux</li>
                            <li>Travaux dirigés et pratiques</li>
                            <li>Évaluations continues</li>
                            <li>Stages en entreprise</li>
                            <li>Activités culturelles et sportives</li>
                        </ul>
                        <h3 className="text-xl font-semibold text-blue-900 mt-6">Recherche & Innovation</h3>
                        <p>
                            L'ENSAJ dispose de deux laboratoires accrédités et développe une recherche scientifique
                            en synergie avec :
                        </p>

                        <ul className="list-disc pl-6 space-y-2">
                            <li>Le réseau universitaire national</li>
                            <li>Les partenaires industriels</li>
                            <li>Les centres de transfert technologique</li>
                        </ul>

                        <p className="mt-4">
                            L'école encourage activement l'innovation et l'entrepreneuriat étudiant à travers :
                        </p>

                        <ul className="list-disc pl-6 space-y-2">
                            <li>Des programmes de création d'entreprise</li>
                            <li>Des compétitions technologiques</li>
                            <li>Des partenariats industriels</li>
                        </ul>

                        <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                            <h4 className="text-lg font-semibold text-blue-900">Engagement Régional</h4>
                            <p>
                                Implantée dans une région en plein développement économique, l'ENSAJ adapte
                                constamment ses formations aux besoins des entreprises locales et internationales,
                                tout en intégrant les dernières innovations technologiques.
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            {/* Pied de page */}
            <footer className="bg-blue-800 text-white py-8">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8 mb-6">
                        <div>
                            <h3 className="text-lg font-bold mb-4">Coordonnées</h3>
                            <p className="text-sm">Route d'Azemmour, Nationale N°1</p>
                            <p className="text-sm">BP : 5096 El Jadida</p>
                            <p className="text-sm">Tel: (+212) 5 23 34 48 22</p>
                            <p className="text-sm">Fax : 05 23 39 49 15</p>
                        </div>
                        <div>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-4">Directeurs</h3>
                            <ul className="space-y-2 text-sm">
                                <li>Pr. Abdelowahed Hajjaji</li>
                                <li>Pr. Mahmoud El Mouden</li>
                                <li>Pr. Aziz Dahbi</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-blue-800 pt-4 text-center text-sm">
                        <p> © 2025 SurvEnsaj. ALL RIGHTS RESERVED.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default About;