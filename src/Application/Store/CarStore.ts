import { makeAutoObservable } from "mobx";
import { CarConfig, model3LowRes } from "../Car/Car";

export class CarStore {
  speedMS: number = 0;
  steeringRad: number = 0;
  applyingForce: number = 0;
  applyingBrake: number = 0;
  carConfig: CarConfig = model3LowRes;

  constructor() {
    makeAutoObservable(this);
  }

  setSpeed(speedMS: number) {
    this.speedMS = speedMS;
  }

  setSteering(steeringRad: number) {
    this.steeringRad = steeringRad;
  }

  // value is from -1 (-100%) to 1 (100%) of the maximum engine force of that car
  // negative mean the car move backward
  applyForce = (value: number) => {
    this.applyingForce = value;
  };

  // value is from 0 to 1 of the maximum brake force of that car
  applyBrake = (value: number) => {
    this.applyingBrake = value;
  };

  setCarConfig = (config: CarConfig) => {
    this.carConfig = config;
  };
}
