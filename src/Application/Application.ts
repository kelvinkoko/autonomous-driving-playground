import * as CANNON from "cannon-es";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { createVehicle } from "./Car";
import { createGround } from "./Ground";
import { createSky } from "./Sky";
import { updateVisual } from "./Utils/Visual";
import { createEnvironment } from "./World/Environment";

const scene = new THREE.Scene();
const camera = setupCamera();
const renderer = setupRenderer();
const controls = new OrbitControls(camera, renderer.domElement);
const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.82, 0)
});

export function start() {
  createEnvironment(scene, renderer);
  createSky(scene);
  createGround(world, scene);
  createVehicle(world, scene);

  animate();
}

function animate() {
  requestAnimationFrame(animate);

  updatePhysics();
  updateVisual();

  renderer.render(scene, camera);
}

function updatePhysics() {
  world.fixedStep();
}

function setupCamera() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
  camera.position.set(5, 1, 0);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  return camera;
}

function setupRenderer() {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  document.body.appendChild(renderer.domElement);
  return renderer;
}
