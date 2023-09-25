import { makeAutoObservable } from "mobx";

export class ApplicationStore {
  isLoading: boolean = true;

  constructor() {
    makeAutoObservable(this);
  }

  setIsLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }
}

export const applicationStore = new ApplicationStore();
