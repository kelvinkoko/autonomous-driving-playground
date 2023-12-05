import * as CANNON from "cannon-es";
import * as THREE from "three";
import { CameraMode, VisualMode } from "../Config/VisualMode";
import {
  setupCamera,
  setupOrbitControls,
  updateCameraFollow,
  updateCameraFollowBehind
} from "./Camera";
import {
  Car,
  CarConfig,
  createVehicle,
  model3HighRes,
  model3LowRes
} from "./Vehicle/Car";
import { DEFAULT_KEYS_1 } from "./Vehicle/CarControlKeys";
``;

import { observe } from "mobx";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { InitState, ModelQuality } from "../Store/ApplicationStore";
import { rootStore } from "../Store/RootStore";
import { updateVisual } from "../Utils/Visual";
import { createTrack } from "./Track/Track";
import { createRayLines } from "./Vehicle/DistanceSensing";
import { createEnvironment } from "./World/Environment";
import { createGround } from "./World/Ground";
import { createSky } from "./World/Sky";

const appStore = rootStore.applicationStore;

const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.82, 0)
});
let car: Car;
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
  car?.reset();
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
    car?.applyDriveCode(code);
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
    let config = model3LowRes;
    switch (change.newValue) {
      case ModelQuality.LOW:
        config = model3LowRes;
        break;
      case ModelQuality.HIGH:
        config = model3HighRes;
        break;
    }
    loadCar(model3LowRes, scene);
  });
}

async function loadCar(config: CarConfig, scene: THREE.Scene) {
  appStore.setInitState(InitState.LOADING);
  car = await createVehicle(
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
  car?.updateVehicle();
}

function updatePhysics(scene: THREE.Scene) {
  world.fixedStep();
  car?.updatePhysics(scene);
}

function updateCamera(camera: THREE.Camera, controls: OrbitControls) {
  if (!car) {
    return;
  }
  switch (VisualMode.cameraMode) {
    case CameraMode.FOLLOW:
      updateCameraFollow(camera, controls, car.vehicle);
      break;
    case CameraMode.FOLLOW_BEHIND:
      updateCameraFollowBehind(camera, controls, car.vehicle);
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
