import { makeAutoObservable } from "mobx";

export class CarStore {
  speedMS: number = 0;
  steeringRad: number = 0;

  constructor() {
    makeAutoObservable(this);
  }

  setSpeed(speedMS: number) {
    this.speedMS = speedMS;
  }

  setSteering(steeringRad: number) {
    this.steeringRad = steeringRad;
  }
}

export const worldStore = new CarStore();
