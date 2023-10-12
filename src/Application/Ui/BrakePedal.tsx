import * as React from "react";
import BrakePedalImage from "../Assets/Images/brake-pedal.png";
import StoreContext from "../Store/StoreContext";
import Pedal from "./Pedal";

const BrakePedal = () => {
  const rootStore = React.useContext(StoreContext);
  const carStore = rootStore.carStore;

  return (
    <Pedal
      min={0}
      max={1}
      onChange={carStore.applyBrake}
      thumbImage={BrakePedalImage}
      imageWidthPx={26}
      imageHeightPx={34}
    />
  );
};

export default BrakePedal;
