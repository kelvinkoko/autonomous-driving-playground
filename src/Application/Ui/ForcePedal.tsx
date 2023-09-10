import * as React from "react";
import ForcePedalImage from "../Assets/Images/force-pedal.png";
import Pedal from "./Pedal";

const ForcePedal = () => {
  return (
    <Pedal
      min={0}
      max={100}
      thumbImage={ForcePedalImage}
      imageWidthPx={30}
      imageHeightPx={49}
    />
  );
};

export default ForcePedal;
