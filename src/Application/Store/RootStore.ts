import { ApplicationStore } from "./ApplicationStore";
import { CarStore } from "./CarStore";

export class RootStore {
  carStore: CarStore;
  applicationStore: ApplicationStore;

  constructor() {
    this.carStore = new CarStore();
    this.applicationStore = new ApplicationStore();
  }
}

export const rootStore = new RootStore();
