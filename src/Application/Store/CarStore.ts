import { makeAutoObservable } from "mobx";
import { CarConfig, model3LowRes } from "../Car/Car";
import { DetectionResult } from "../Car/DetectionResult";

export class CarStore {
  speedMS: number = 0;
  steeringRad: number = 0;
  applyingForce: number = 0;
  applyingBrake: number = 0;
  carConfig: CarConfig = model3LowRes;
  detectionResult: Array<DetectionResult> = [];
  isManualDriving: boolean = false;
  isAutopilotEnabled: boolean = false;
  lapTimeStartMs: number = 0;

  constructor() {
    makeAutoObservable(this);
  }

  setSpeed(speedMS: number) {
    this.speedMS = speedMS;
  }

  setSteering(steeringRad: number) {
    this.steeringRad = steeringRad;
  }

  // value is from -1 (-100%) to 1 (100%) of the maximum engine force of that car
  // negative mean the car move backward
  applyForce = (value: number) => {
    this.applyingForce = value;
  };

  // value is from 0 to 1 of the maximum brake force of that car
  applyBrake = (value: number) => {
    this.applyingBrake = value;
  };

  setCarConfig = (config: CarConfig) => {
    this.carConfig = config;
  };

  setDetectionResult = (result: DetectionResult[]) => {
    this.detectionResult = result;
  };

  setIsManualDriving = (isManual: boolean) => {
    this.isManualDriving = isManual;
  };

  setIsAutopilotEnable = (enable: boolean) => {
    this.isAutopilotEnabled = enable;
  };

  recordStartLapTime = () => {
    this.lapTimeStartMs = Date.now();
  };
}
