import { makeAutoObservable } from "mobx";

export class ApplicationStore {
  initState: InitState = InitState.MODEL_SELECTION;
  modelQuality: ModelQuality | undefined = undefined;
  editorCode: string = "";
  driveCode: string = "";
  log: string = "";

  constructor() {
    makeAutoObservable(this);
  }

  setInitState(state: InitState) {
    this.initState = state;
  }

  setModelQuality(quality: ModelQuality) {
    this.modelQuality = quality;
  }

  setEditorCode(code: string) {
    this.editorCode = code;
  }

  setDriveCode(code: string) {
    this.driveCode = code;
  }

  setLog(log: string) {
    this.log = log;
  }
}

export enum ModelQuality {
  LOW,
  HIGH
}

export enum InitState {
  MODEL_SELECTION,
  LOADING,
  READY
}

export const applicationStore = new ApplicationStore();
