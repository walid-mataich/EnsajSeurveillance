import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { FaUserCheck } from "react-icons/fa";

const SubmissionStatus = () => {
  const [submitted, setSubmitted] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/choix");
        setSubmitted(res.data);
        const allSurvs = await api.get("/surveillants");
        setTotal(allSurvs.data.length);
      } catch (error) {
        console.error("Erreur de chargement :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <span className="animate-pulse text-gray-500">Chargement...</span>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 w-fit mx-auto mb-6 flex items-center space-x-4 border border-gray-200">
      <FaUserCheck className="text-blue-600 text-3xl" />
      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          Soumissions des choix
        </h3>
        <p className="text-sm text-gray-600">
          <span className="font-medium text-blue-700">{submitted}</span> sur{" "}
          <span className="font-medium">{total}</span> surveillants ont soumis
          leurs choix
        </p>
      </div>
    </div>
  );
};

export default SubmissionStatus;
