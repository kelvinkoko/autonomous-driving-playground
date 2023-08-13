import * as CANNON from "cannon-es";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { createVehicle } from "./Car";
import { createGround } from "./Ground";
import { updateVisual } from "./Utils/Visual";

const scene = new THREE.Scene();
const camera = setupCamera();
const renderer = setupRenderer();
const controls = new OrbitControls(camera, renderer.domElement);
const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.82, 0)
});

export function start() {
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
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;
  return camera;
}

function setupRenderer() {
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  return renderer;
}
