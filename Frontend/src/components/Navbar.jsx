import React, { useState } from "react";
import ensalogo from "../assets/logo.png";
import logosombre from "../assets/logo-sombre.png";
import { Link } from "react-router-dom";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-gray-200 dark:bg-blue-800">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-3">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img
            src={logosombre}
            className="h-8 hidden dark:block"
            alt="logo sombre"
          />
          <img
            src={ensalogo}
            className="h-8 block dark:hidden"
            alt="logo clair"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-blue-800 dark:text-white">
            SurvEnsaj
          </span>
        </Link>

        {/* Menu mobile toggle button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-blue-800 rounded-lg md:hidden hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-sky-800 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded={isOpen}
        >
          <span className="sr-only">Open main menu</span>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 17 14">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>

        {/* Menu links */}
        <div
          className={`${isOpen ? "block" : "hidden"} w-full md:block md:w-auto`}
          id="navbar-default"
        >
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-white dark:bg-blue-800 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-blue-800 dark:border-gray-700">
            {["Home", "Login", "About", "Contact"].map((text) => (
              <li key={text}>
                <Link
                  to={
                    text === "Home"
                      ? "/"
                      : text === "Login"
                      ? "/log"
                      : `/${text.toLowerCase()}`
                  }
                  className="group relative block py-2 px-3 text-blue-800 dark:text-white"
                >
                  {text}
                  <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
