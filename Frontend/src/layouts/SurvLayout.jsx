import React from "react";
import {Outlet} from "react-router-dom";
import SurvSidebar from "../components/SurvSidebar";
import ChatBot from "../components/Chatbot";

const SurvLayout = () => {
  return (
    <>
      <SurvSidebar />
      <div className="p-6 sm:ml-64 bg-stone-0">
        <Outlet />
      </div>
      <ChatBot />
    </>
  );
};

export default SurvLayout;
