import React from "react";
import { NavLink } from "react-router-dom";

const SidebarItem = ({ children, text, path }) => {
  return (
    <li>
      <NavLink
        to={path}
        className={({ isActive }) =>
          `flex items-center p-2 rounded-lg group ${
            isActive
              ? "bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
              : "text-white dark:text-white hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700"
          }`
        }
      >
        {children}
        <span className="ms-3">{text}</span>
      </NavLink>
    </li>
  );
};

export default SidebarItem;
