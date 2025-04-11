import React from "react";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { button } from "framer-motion/client";

const ChoixBySurv = () => {
  const [choix, setChoix] = useState([]);
  const [id, setId] = useState("2");

  useEffect(() => {
    let isMounted = true;
    const fetchChoix = async () => {
      try {
        const response = await api.get(`/choix/${id}`);
        if (isMounted) {
          setChoix(response.data);
          console.log(response.data); // Log the fresh data instead of state
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error fetching choix:", err);
        }
      }
    };
    fetchChoix();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return (
    <>
      <label htmlFor="id">enter the id :</label>
      <input
        type="text"
        className="border-1"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      {/* {(choix != []) && (<h1>{choix[0].surveillant.nom}</h1>)} */}
      <div className="flex justify-center mt-4">
        
        {choix.map((c) => (
          <button
            className={` rounded m-2 p-1 ${
              c.ordre === -1
                ? "bg-red-500"
                : c.ordre === 0
                ? "bg-yellow-500"
                : "bg-green-500" // For all other values of 'ordre'
            } `}
          >
            {c.examen.matiere.nomMatiere}
          </button>
        ))}
      </div>
    </>
  );
};

export default ChoixBySurv;
