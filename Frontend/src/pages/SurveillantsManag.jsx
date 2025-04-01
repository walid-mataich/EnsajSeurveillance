import React from "react";
import api from "../api/axios";
import { useEffect, useState } from "react";
import { li } from "framer-motion/client";

const SurveillantsManag = () => {
  const [surveillants, setSurveillants] = useState([]);

  useEffect(() => {
    const fetchSurv = async () => {
      try {
        const response = await api.get("surveillants");
        setSurveillants(response.data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des surveillants:",
          error
        );
      }
    };
    fetchSurv();
  }, []);

  return (
    <>
      <div className="flex">
        <table>
        <thead className="text-xs text-gray-700 uppercase bg-gray-200  ">
            <tr >
                <th scope="col" className="px-6 py-3 ">
                    Nom
                </th>
                <th scope="col" className="px-6 py-3">
                    Email
                </th>
                <th scope="col" className="px-6 py-3">
                   Type
                </th>
                <th scope="col" className="px-6 py-3">
                    Action
                </th>
            </tr>
        </thead>
        <tbody>
        {surveillants.map((surv) => (
            <tr className="bg-gray-50">
            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                {surv.nom}
            </th>
            <td class="px-6 py-4">
                {surv.email}
            </td>
            <td class="px-6 py-4">
                {surv.type}
            </td>
            <td class="px-6 py-4">
                <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">modifier</a>
            </td>
        </tr>
          ))}
          </tbody>
          </table>

        {/* <ul>
          {surveillants.map((surv) => (
            <li key={surv.id}>{surv.nom}</li>
          ))}
        </ul> */}
      </div>
    </>
  );
};

export default SurveillantsManag;
