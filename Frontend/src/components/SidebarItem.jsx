import React from "react";
import { NavLink } from "react-router-dom";

const SidebarItem = ({ children, text, path }) => {
  return (
    <li>
      <NavLink
        to={path}
        className={({ isActive }) =>
          `flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${
            isActive && "bg-gray-700"
          }`
        }
      >
        {children}

        <span className="ms-3 decoration-white">{text}</span>
      </NavLink>
    </li>
  );
};

export default SidebarItem;
