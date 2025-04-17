import React from "react";
import CountUp from "../components/Count";
import Planning from "../components/Planning";
import ExamSchedule from "../components/ExamSchedule";
import BarChartOne from "../components/BarChartOne";
import { Users, School } from "lucide-react";
import ExamProgress from "../components/ExamProgress";
import api from "../api/axios";

import Countdown from "react-countdown";

import { PieChart } from "@mui/x-charts";
import { useState, useEffect, useRef } from "react";

function AdminDashboard() {

  const [surveillants, setSurveillants] = useState([]);
  const [exams, setExams] = useState([]);
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

  useEffect(() => {
    const fetchex = async () => {
      try {
        const response = await api.get("examen/all");
        setExams(response.data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des surveillants:",
          error
        );
      }
    };
    fetchex();
  }, []);

  return (
    <>
      <div className="flex flex-wrap justify-center gap-4">
        <div className="min-w-[300px]  flex-2 h-100 bg-neutral-50 rounded-md shadow-md flex flex-col gap-6 justify-center items-center">
          <h1 className="text-2xl font-bold ">types des surveillants</h1>

          <BarChartOne />
        </div>
        <div className="min-w-[150px] max-w-[300px] flex-1 h-52 bg-neutral-50 shadow-md rounded-md flex flex-col gap-6 justify-center items-center">
          <h1 className="text-2xl font-bold text-center ">
            <School />
            Nombre des examens
          </h1>
          <CountUp
            from={0}
            to={exams.length}
            separator=","
            direction="up"
            duration={1}
            className="count-up-text text-5xl font-bold "
          />
        </div>
        <div className="min-w-[150px] max-w-[300px] flex-1 h-52 bg-neutral-50 shadow-md rounded-md flex flex-col gap-6 justify-center items-center">
          <h1 className="text-2xl font-bold ">
            <Users />
            Nbr des surveillants
          </h1>
          <CountUp
            from={0}
            to={surveillants.length}
            separator=","
            direction="up"
            duration={1}
            className="count-up-text text-5xl font-bold "
          />
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
