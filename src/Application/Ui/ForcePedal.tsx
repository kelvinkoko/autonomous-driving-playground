import * as React from "react";
import ForcePedalImage from "../Assets/Images/force-pedal.png";
import StoreContext from "../Store/StoreContext";
import Pedal from "./Pedal";

const ForcePedal = () => {
  const rootStore = React.useContext(StoreContext);
  const carStore = rootStore.carStore;

  return (
    <Pedal
      min={0}
      max={1}
      onChange={carStore.applyForce}
      thumbImage={ForcePedalImage}
      imageWidthPx={30}
      imageHeightPx={49}
    />
  );
};

export default ForcePedal;
