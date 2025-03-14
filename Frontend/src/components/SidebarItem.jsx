import React from 'react'

const SidebarItem = ({children,text,}) => {
  return (
    <li>
    <a
      href="#"
      className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
    >
      {children}

      <span className="ms-3">{text}</span>
    </a>
    </li>

  )
}

export default SidebarItem