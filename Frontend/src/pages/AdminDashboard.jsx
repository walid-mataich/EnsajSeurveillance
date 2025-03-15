import React from "react";
import CountUp from "../components/Count";
import Matieres from "../components/Matiere";
import Sidebar from "../components/Sidebar";
import ExamenForm from "../components/ExamenForm";
import Planning from "../components/Planning";
import ExamSchedule from "../components/ExamSchedule";

import { PieChart } from "@mui/x-charts";
import { useState, useEffect, useRef } from "react";

function AdminDashboard() {
  return (
    <>
      <Sidebar />
      {/*  */}

      <div className="p-6 sm:ml-64">
        <ExamSchedule />
        <div className="flex-1 flex items-center justify-center p-6">
          <ExamenForm />
        </div>
      </div>

      {/* <div class="p-4 sm:ml-64">
        <div>
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
        </div>
        <Matieres />
        </div>
      */}
    </>
  );
}

export default AdminDashboard;
