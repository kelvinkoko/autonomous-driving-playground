import { action, makeObservable, observable } from "mobx";
import { CarState } from "../Car/CarState";

export class WorldStore {
  carState: CarState = { speedMS: 0 };

  constructor() {
    makeObservable(this, {
      carState: observable,
      updateCar: action
    });
  }

  updateCar(state: CarState) {
    this.carState = state;
  }
}

export const worldStore = new WorldStore();
