import { makeAutoObservable } from "mobx";

export class ApplicationStore {
  initState: InitState = InitState.MODEL_SELECTION;
  modelQuality: ModelQuality | undefined = undefined;
  editorCode: string = "";
  driveCode: string = "";
  log: string = "";
  isShowingCodePane: boolean = false;

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

  setIsShowingCodePane(value: boolean) {
    this.isShowingCodePane = value;
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
