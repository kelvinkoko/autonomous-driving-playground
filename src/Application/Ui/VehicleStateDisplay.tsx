import * as React from "react";

interface Props {
  speedMS: number;
}

const VehicleStateDisplay = ({ speedMS }: Props) => {
  return <p>{speedMS}</p>;
};

export default VehicleStateDisplay;
