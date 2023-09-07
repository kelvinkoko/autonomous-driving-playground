import { makeAutoObservable } from "mobx";

export class CarStore {
  speedMS: number = 0;
  steeringRad: number = 0;

  constructor() {
    makeAutoObservable(this);
  }
}

export const worldStore = new CarStore();
