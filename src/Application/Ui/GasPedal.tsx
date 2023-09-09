import * as React from "react";
import GasPedalImage from "../Assets/Images/gas-pedal.png";
import Pedal from "./Pedal";

const GasPedal = () => {
  return (
    <Pedal
      min={0}
      max={100}
      thumbImage={GasPedalImage}
      imageWidthPx={30}
      imageHeightPx={49}
    />
  );
};

export default GasPedal;
