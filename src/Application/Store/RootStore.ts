import { CarStore } from "./CarStore";

export class RootStore {
  carStore: CarStore;

  constructor() {
    this.carStore = new CarStore();
  }
}

export const rootStore = new RootStore();
