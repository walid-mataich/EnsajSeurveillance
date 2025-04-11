import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Log() {
  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-blue-600 flex flex-col items-center justify-center text-white px-4">
      <h1 className="text-4xl font-bold mb-6">Bienvenue à SurvEnsaj</h1>
      <p className="text-lg mb-10 text-center">
        Plateforme pour automatiser la gestion de la surveillance des examens
      </p>

      <div className="flex gap-6">
        <Link
          to="/admin"
          className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-2xl shadow-lg hover:bg-gray-100 transition"
        >
          Espace Administration
        </Link>
        <Link
          to="/surv"
          className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-2xl shadow-lg hover:bg-gray-100 transition"
        >
          Espace Surveillant
        </Link>
      </div>
    </div>
    </>
  );
}
