import * as CANNON from "cannon-es";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { toThreeQuaternion, toThreeVector3 } from "./Utils/Conversion";

export function setupCamera() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
  camera.position.set(-5, 1, 0);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  return camera;
}

export function setupOrbitControls(
  camera: THREE.Camera,
  renderer: THREE.WebGLRenderer
) {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  controls.rotateSpeed = 0.25;
  controls.zoomSpeed = 0.5;
  controls.panSpeed = 0.5;
  return controls;
}

export function updateCameraFollow(
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls,
  vehicle: CANNON.RaycastVehicle,
  offsetDistance: number = 10
): void {
  const azimuthalAngle = controls.getAzimuthalAngle();
  const polarAngle = controls.getPolarAngle();

  const offsetDir = new THREE.Vector3(
    Math.sin(azimuthalAngle) * Math.sin(polarAngle) * offsetDistance,
    Math.cos(polarAngle) * offsetDistance,
    Math.cos(azimuthalAngle) * Math.sin(polarAngle) * offsetDistance
  );

  const carPos = vehicle.chassisBody.position;
  const desiredPosition = new THREE.Vector3().addVectors(
    toThreeVector3(carPos),
    offsetDir
  );

  camera.position.lerp(desiredPosition, 1);
  controls.target.lerp(new THREE.Vector3(carPos.x, carPos.y, carPos.z), 1);
  controls.update();
}

export function updateCameraFollowBehind(
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls,
  vehicle: CANNON.RaycastVehicle,
  offsetDistance: number = 12,
  offsetHeight: number = 3
): void {
  const vehicleQuaternion = toThreeQuaternion(vehicle.chassisBody.quaternion);

  const forwardDir = new THREE.Vector3(-1, 0, 0);
  forwardDir.applyQuaternion(vehicleQuaternion);
  const backwardDir = forwardDir.negate();

  const offsetDir = backwardDir.multiplyScalar(offsetDistance);
  offsetDir.y += offsetHeight;

  const carPos = vehicle.chassisBody.position;
  const desiredPosition = new THREE.Vector3().addVectors(
    toThreeVector3(carPos),
    offsetDir
  );

  camera.position.lerp(desiredPosition, 0.05);
  controls.target.set(carPos.x, carPos.y, carPos.z);
  controls.update();
}
