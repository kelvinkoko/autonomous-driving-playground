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
import { createTrack } from "./Environment/Track";
import { createGround } from "./Ground";
import { createSky } from "./Sky";
import { InitState, ModelQuality } from "./Store/ApplicationStore";
import { rootStore } from "./Store/RootStore";
import { updateVisual } from "./Utils/Visual";
import { createEnvironment } from "./World/Environment";

const appStore = rootStore.applicationStore;

const scene = new THREE.Scene();
const camera = setupCamera();
const renderer = setupRenderer();
const controls = setupOrbitControls(camera, renderer);

const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.82, 0)
});
let vehicle: CANNON.RaycastVehicle;

window.addEventListener("resize", onWindowResize, false);

export async function start() {
  createEnvironment(scene, renderer);
  createSky(scene);
  createGround(world, scene);
  createTrack(scene);
  animate();

  observe(appStore, "modelQuality", change => {
    switch (change.newValue) {
      case ModelQuality.LOW:
        loadCar(model3LowRes);
        break;
      case ModelQuality.HIGH:
        loadCar(model3HighRes);
        break;
    }
  });
}

async function loadCar(config: CarConfig) {
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

function animate() {
  requestAnimationFrame(animate);

  updatePhysics();
  updateVisual();
  updateCamera();

  renderer.render(scene, camera);
}

function updatePhysics() {
  world.fixedStep();
  if (vehicle) {
    rootStore.carStore.setSpeed(vehicle.chassisBody.velocity.length());
  }
}

function updateCamera() {
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

function setupRenderer() {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const container = document.getElementById("canvas");
  container?.appendChild(renderer.domElement);
  return renderer;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}
