import { CarStore } from "./CarStore";

export class WorldStore {
  carStore: CarStore;

  constructor() {
    this.carStore = new CarStore();
  }
}

export const worldStore = new WorldStore();
