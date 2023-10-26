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
import { ENABLE_CODE_EDITOR } from "./Config/FeatureFlag";
import { createTrack } from "./Environment/Track";
import { createGround } from "./Ground";
import { createSky } from "./Sky";
import { InitState, ModelQuality } from "./Store/ApplicationStore";
import { rootStore } from "./Store/RootStore";
import { updateVisual } from "./Utils/Visual";
import { createEnvironment } from "./World/Environment";

const ENABLE_SELF_DRIVE = ENABLE_CODE_EDITOR;

const appStore = rootStore.applicationStore;
const carStore = rootStore.carStore;

const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.82, 0)
});
let vehicle: CANNON.RaycastVehicle;

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
  observe(appStore, "driveCode", change => {
    try {
      eval(change.newValue);
      appStore.setLog("Deployed!");
    } catch (error) {
      if (error instanceof SyntaxError) {
        appStore.setLog(error.message);
      } else {
        appStore.setLog("Error, please check the code");
        throw error;
      }
    }
  });
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
  const initCarPosition = new CANNON.Vec3(0, 4, 0);
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
  if (ENABLE_SELF_DRIVE && !carStore.isManualDriving) {
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
    rootStore.carStore.setSpeed(vehicle.chassisBody.velocity.length());
    const result = detectNearestObjects(scene, vehicle, carStore.carConfig);
    rootStore.carStore.setDetectionResult(result);
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
