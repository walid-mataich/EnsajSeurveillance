import React from "react";

const LoadingPulse = () => {
  return (
    <div className="flex space-x-2 justify-center items-center bg-white  h-full p-100">
      <div className="h-4 w-4 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="h-4 w-4 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="h-4 w-4 bg-blue-600 rounded-full animate-bounce"></div>
    </div>
  );
};

export default LoadingPulse;
