import * as CANNON from "cannon-es";
import * as THREE from "three";
import {
  setupCamera,
  setupOrbitControls,
  updateCameraFollow,
  updateCameraFollowBehind
} from "./Camera";
import {
  CarConfig,
  createVehicle,
  model3HighRes,
  model3LowRes
} from "./Car/Car";
import { DEFAULT_KEYS_1 } from "./Car/CarControlKeys";
import { CameraMode, VisualMode } from "./Config/VisualMode";

import { observe } from "mobx";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DetectionResult } from "./Car/DetectionResult";
import { createRayLines, detectNearestObjects } from "./Car/DistanceSensing";
import { createTrack } from "./Environment/Track";
import { createGround } from "./Ground";
import { createSky } from "./Sky";
import { InitState, ModelQuality } from "./Store/ApplicationStore";
import { rootStore } from "./Store/RootStore";
import { updateVisual } from "./Utils/Visual";
import { createEnvironment } from "./World/Environment";

const appStore = rootStore.applicationStore;
const carStore = rootStore.carStore;

const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.82, 0)
});
let vehicle: CANNON.RaycastVehicle;
const initCarPosition = new CANNON.Vec3(0, 2, 0);

export async function start(container: HTMLElement) {
  const scene = new THREE.Scene();
  const camera = setupCamera(container);
  const renderer = setupRenderer(container);
  const controls = setupOrbitControls(camera, renderer);
  setupOnResize(container, renderer, camera);

  createEnvironment(scene, renderer);
  createSky(scene);
  createGround(world, scene);
  createTrack(scene);
  if (VisualMode.showSensing) {
    createRayLines(scene);
  }

  animate(renderer, scene, camera, controls);

  waitForModelSelection(scene);
  initDriveCode();
}

export function reset() {
  if (!vehicle) {
    return;
  }
  carStore.applyBrake(0);
  carStore.applyForce(0);
  carStore.setSteering(0);
  carStore.recordStartLapTime();
  vehicle.chassisBody.position.copy(initCarPosition);
  vehicle.chassisBody.quaternion.set(0, 1, 0, 0);
  vehicle.chassisBody.angularVelocity.set(0, 0, 0);
  vehicle.chassisBody.velocity.set(0, 0, 0);
}

function initDriveCode() {
  applyDriveCode(appStore.editorCode);
  observe(appStore, "driveCode", change => {
    applyDriveCode(change.newValue);
  });
}

function applyDriveCode(code: string) {
  const appStore = rootStore.applicationStore;
  try {
    eval(code);
    appStore.setLog("Drive code deployed!");
    appStore.appendLog("Enable Autopilot to test the logic");
  } catch (error) {
    if (error instanceof SyntaxError) {
      appStore.setLog(error.message);
    } else {
      appStore.setLog("Error, please check the code");
      throw error;
    }
  }
}

function waitForModelSelection(scene: THREE.Scene) {
  observe(appStore, "modelQuality", change => {
    switch (change.newValue) {
      case ModelQuality.LOW:
        carStore.setCarConfig(model3LowRes);
        break;
      case ModelQuality.HIGH:
        carStore.setCarConfig(model3HighRes);
        break;
    }
    loadCar(carStore.carConfig, scene);
  });
}

async function loadCar(config: CarConfig, scene: THREE.Scene) {
  appStore.setInitState(InitState.LOADING);
  vehicle = await createVehicle(
    initCarPosition,
    DEFAULT_KEYS_1,
    world,
    scene,
    rootStore.carStore,
    config
  );
  appStore.setInitState(InitState.READY);
  carStore.recordStartLapTime();
}

function animate(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.Camera,
  controls: OrbitControls
) {
  requestAnimationFrame(() => {
    animate(renderer, scene, camera, controls);
  });

  updatePhysics(scene);
  updateVehicle();
  updateVisual();
  updateCamera(camera, controls);

  renderer.render(scene, camera);
}

function updateVehicle() {
  if (!vehicle) {
    return;
  }
  const detectionResult = carStore.detectionResult;
  if (!carStore.isManualDriving && carStore.isAutopilotEnabled) {
    const action = runSelfDrive(detectionResult);
    carStore.applyForce(action.force);
    carStore.applyBrake(action.brake);
    carStore.setSteering(action.steering);
  }
}

let drive: (_: DetectionResult[]) => DriveAction;

function runSelfDrive(detectionResult: DetectionResult[]): DriveAction {
  if (!drive) {
    return { force: 0, brake: 0, steering: 0 };
  }
  return drive(detectionResult);
}

interface DriveAction {
  force: number;
  brake: number;
  steering: number;
}

function updatePhysics(scene: THREE.Scene) {
  world.fixedStep();
  if (vehicle) {
    carStore.setSpeed(vehicle.chassisBody.velocity.length());
    carStore.updatePosition(
      vehicle.chassisBody.position.x,
      vehicle.chassisBody.position.z
    );
    const result = detectNearestObjects(scene, vehicle, carStore.carConfig);
    carStore.setDetectionResult(result);
  }
}

function updateCamera(camera: THREE.Camera, controls: OrbitControls) {
  if (!vehicle) {
    return;
  }
  switch (VisualMode.cameraMode) {
    case CameraMode.FOLLOW:
      updateCameraFollow(camera, controls, vehicle);
      break;
    case CameraMode.FOLLOW_BEHIND:
      updateCameraFollowBehind(camera, controls, vehicle);
      break;
    default:
    // No action
  }
}
function setupRenderer(container: HTMLElement) {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  container.appendChild(renderer.domElement);
  return renderer;
}

export let onCanvasResize: () => void | undefined;

function setupOnResize(
  container: HTMLElement,
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera
) {
  onCanvasResize = () => {
    onWindowResize(container, renderer, camera);
  };
  window.addEventListener("resize", onCanvasResize, false);
}

function onWindowResize(
  container: HTMLElement,
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera
) {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(container.clientWidth, container.clientHeight);
}
