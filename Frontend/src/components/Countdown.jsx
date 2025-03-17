import React from "react";
import Countdown from "react-countdown";

const Countdown = () => {
  return <Countdown date={Date.now() + 10000} />;
};

export default Countdown;
