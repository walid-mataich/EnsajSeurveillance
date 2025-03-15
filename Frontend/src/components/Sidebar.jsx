import React, { useEffect, useRef, useState } from "react";
import {
  Menu,
  LayoutDashboardIcon,
  NotebookPen,
  Users,
  SquarePen,
  BellRing,
  CircleUser,
} from "lucide-react";
import SidebarItem from "./SidebarItem";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <Menu className="w-6 h-6" />
      </button>
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 z-40 w-64 h-screen bg-gray-50 dark:bg-blue-800 transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          <div className="flex justify-center items-center mb-4">
            <img src="/logo.png" alt="Logo" className="w-24" />
          </div>

          <ul className="space-y-2 font-medium">
            <SidebarItem text="Dashboard">
              <LayoutDashboardIcon />
            </SidebarItem>

            <SidebarItem text="Examens">
              <NotebookPen />
            </SidebarItem>

            <SidebarItem text="Surveilants">
              <Users />
            </SidebarItem>

            <SidebarItem text="Assignation">
              <SquarePen />
            </SidebarItem>

            <SidebarItem text="Notification">
              <BellRing />
            </SidebarItem>

            <SidebarItem text="Profile">
              <CircleUser />
            </SidebarItem>
          </ul>
        </div>
      </aside>
      
    </>
  );
};

export default Sidebar;
