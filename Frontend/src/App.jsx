import React from "react";
import CountUp from "./components/Count";
import Matieres from "./components/Matiere";

import { PieChart } from "@mui/x-charts";

import { FaHome, FaUsers, FaCalendar, FaInbox, FaUser } from "react-icons/fa";
import "./App.css";

function App() {
  return (
    <>
      <div className="flex">
        <div className="w-20 md:w-64 bg-indigo-800 h-screen ">
          <div className="flex justify-between items-center bg-white p-4 border-right">
            <h2 className="text-xl font-bold">SurvEnsaj</h2>
          </div>
          <nav className="text-white ">
            <ul>
              <li className="flex items-center p-4 hover:bg-neutral-100 hover:text-black  cursor-pointer">
                <FaHome size={24} />
                <span className="ml-4 md:block">Dashboard</span>
              </li>
            </ul>
            <ul>
              <li className="flex items-center p-4 hover:bg-neutral-100 hover:text-black cursor-pointer">
                <FaUsers size={24} />
                <span className="ml-4 md:block">Gerer les surveillant</span>
              </li>
            </ul>
            <ul>
              <li className="flex items-center p-4 hover:bg-neutral-100 hover:text-black  cursor-pointer">
                <FaCalendar size={24} />
                <span className="ml-4 md:block">Plannings</span>
              </li>
            </ul>
            <ul>
              <li className="flex items-center p-4 hover:bg-neutral-100 hover:text-black  cursor-pointer">
                <FaInbox size={24} />
                <span className="ml-4 md:block">notification</span>
              </li>
            </ul>
            <ul>
              <li className="flex items-center p-4 hover:bg-neutral-100 hover:text-black cursor-pointer">
                <FaUser size={24} />
                <span className="ml-4 md:block">Profile</span>
              </li>
            </ul>
          </nav>
        </div>
        <div className="text-center ml-auto m-10  rounded-md p-9 ">
          <h1 className="text-2xl font-bold">Types des surveillants</h1>

           <PieChart
            series={[
              {
                data: [
                  { id: 0, value: 35, label: "Professeurs" },
                  { id: 1, value: 10, label: "Vacataires" },
                  { id: 2, value: 15, label: "Doctorants" },
                ],
              },
            ]}
            width={400}
            height={200}
          /> 
        </div>
        <div className="text-center ml-auto m-10  rounded-md p-9 ">
          <h1 className="text-2xl font-bold">Nombre se surveillants</h1>
          <CountUp
            from={0}
            to={60}
            separator=","
            direction="up"
            duration={1}
            className="count-up-text text-5xl font-bold"
          />
        </div>
        <div className="text-center  m-10  rounded-md p-9 ">
          <h1 className="text-2xl font-bold">Nombre des examens</h1>
          <CountUp
            from={0}
            to={178}
            separator=","
            direction="up"
            duration={1}
            className="count-up-text text-5xl font-bold"
          />
        </div>
        <Matieres />
      </div>
    </>
  );
}

export default App;
