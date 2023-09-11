import * as React from "react";
import ForcePedalImage from "../Assets/Images/force-pedal.png";
import StoreContext from "../Store/StoreContext";
import Pedal from "./Pedal";
import { MAX_FORCE } from "../Car/Car";

const ForcePedal = () => {
  const rootStore = React.useContext(StoreContext);
  const carStore = rootStore.carStore;

  return (
    <Pedal
      min={0}
      max={MAX_FORCE}
      onChange={carStore.applyForce}
      thumbImage={ForcePedalImage}
      imageWidthPx={30}
      imageHeightPx={49}
    />
  );
};

export default ForcePedal;
