import React from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import ChatBot from "../components/Chatbot";

const AdminLayout = () => {
  return (
    <>
      <Sidebar />
      <div className="p-6 sm:ml-64 bg-stone-0">
        <Outlet />
      </div>
      <ChatBot />
    </>
  );
};

export default AdminLayout;
