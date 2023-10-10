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

  applyForce = (value: number) => {
    this.applyingForce = value;
  };

  applyBrake = (value: number) => {
    this.applyingBrake = value;
  };

  setCarConfig = (config: CarConfig) => {
    this.carConfig = config;
  };
}
