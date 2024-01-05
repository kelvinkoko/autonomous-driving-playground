import { makeAutoObservable } from "mobx";
import { Tab } from "../Tab";

export class ApplicationStore {
  private defaultLogic = `this.drive = (detectionResult) => {
    const diff = detectionResult[1].distance - detectionResult[7].distance;
    const steering = Math.max(-0.7, Math.min(diff, 0.7));
    return {
      force: 0.4,
      brake: 0,
      steering
    };
  }`;

  initState: InitState = InitState.MODEL_SELECTION;
  modelQuality: ModelQuality | undefined = undefined;
  editorCode: string = this.defaultLogic;
  wasmModule: any = null;
  log: string = "";
  isShowingCodePane: boolean = false;
  isShowingManualInstruction: boolean = false;
  codeTab: Tab = Tab.JS;

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

  setWasmModule(wasmModule: any) {
    this.wasmModule = wasmModule;
  }

  setLog(log: string) {
    this.log = log;
  }

  appendLog(log: string) {
    this.log += "\n" + log;
  }

  setIsShowingCodePane(value: boolean) {
    this.isShowingCodePane = value;
  }

  setIsShowingManualInstruction(value: boolean) {
    this.isShowingManualInstruction = value;
  }

  setTab(tab: Tab) {
    this.codeTab = tab;
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
