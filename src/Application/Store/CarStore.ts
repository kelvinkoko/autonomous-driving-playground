import { makeAutoObservable } from "mobx";

export class CarStore {
  speedMS: number = 0;
  steeringRad: number = 0;
  applyingForce: number = 0;
  applyingBrake: number = 0;

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
}

export const worldStore = new CarStore();
