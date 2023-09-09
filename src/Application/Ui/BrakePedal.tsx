import * as React from "react";
import BrakePedalImage from "../Assets/Images/brake-pedal.png";
import Pedal from "./Pedal";

const BrakePedal = () => {
  return (
    <Pedal
      min={0}
      max={100}
      thumbImage={BrakePedalImage}
      imageWidthPx={26}
      imageHeightPx={34}
    />
  );
};

export default BrakePedal;
