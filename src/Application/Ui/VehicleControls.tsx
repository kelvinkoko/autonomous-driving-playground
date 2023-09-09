import { observer } from "mobx-react";
import * as React from "react";
import { CarStore } from "../Store/CarStore";
import BrakePedal from "./BrakePedal";
import GasPedal from "./GasPedal";
import glassPanelStyles from "./GlassPanels.css";
import SteeringWheel from "./SteeringWheel";

interface Props {
  carStore: CarStore;
}

const VehicleControls = observer(({ carStore }: Props) => {
  return (
    <div className={glassPanelStyles.grayPanel}>
      <SteeringWheel carStore={carStore} />
      <BrakePedal />
      <GasPedal />
    </div>
  );
});

export default VehicleControls;
