import { RaycastVehicle } from "cannon-es";
import * as THREE from "three";
import { VisualMode } from "../Config/VisualMode";
import { toThreeQuaternion } from "../Utils/Conversion";
import { CarConfig } from "./Car";
import { DetectionResult } from "./DetectionResult";

const MAX_SENSING_DISTANCE = 5;
export const SENSIBLE_OBJECT_LAYER = 1;

const raycaster = new THREE.Raycaster();
raycaster.layers.set(SENSIBLE_OBJECT_LAYER);

const rayLines: THREE.Line[] = [];

export function detectNearestObjects(
  scene: THREE.Scene,
  vehicle: RaycastVehicle,
  carConfig: CarConfig
): Array<DetectionResult> {
  const position = new THREE.Vector3(
    vehicle.chassisBody.position.x,
    0,
    vehicle.chassisBody.position.z
  );
  const vehicleDirection = getHorizontalRotationAngle(
    toThreeQuaternion(vehicle.chassisBody.quaternion)
  );

  // Define directions for 8 evenly spaced angles (0 to 2π radians)
  const directions: THREE.Vector3[] = [];
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI / 4) * i + vehicleDirection; // 45-degree intervals
    const direction = new THREE.Vector3(
      Math.cos(angle),
      0,
      Math.sin(angle)
    ).normalize();
    directions.push(direction);
  }

  const positions: THREE.Vector3[] = [];
  const width = carConfig.width;
  const length = carConfig.length;

  const front = new THREE.Vector3(length / 2, 0, 0);
  const frontRightCorner = new THREE.Vector3(length / 2, 0, width / 2);
  const right = new THREE.Vector3(0, 0, width / 2);
  const rightRearCorner = new THREE.Vector3(-length / 2, 0, width / 2);
  const rear = new THREE.Vector3(-length / 2, 0, 0);
  const rearLeftCorner = new THREE.Vector3(-length / 2, 0, -width / 2);
  const left = new THREE.Vector3(0, 0, -width / 2);
  const leftFrontCorner = new THREE.Vector3(length / 2, 0, -width / 2);

  // Rotate each vector by the provided angle
  const yAxis = new THREE.Vector3(0, -1, 0);
  front.applyAxisAngle(yAxis, vehicleDirection);
  frontRightCorner.applyAxisAngle(yAxis, vehicleDirection);
  right.applyAxisAngle(yAxis, vehicleDirection);
  rightRearCorner.applyAxisAngle(yAxis, vehicleDirection);
  rear.applyAxisAngle(yAxis, vehicleDirection);
  rearLeftCorner.applyAxisAngle(yAxis, vehicleDirection);
  left.applyAxisAngle(yAxis, vehicleDirection);
  leftFrontCorner.applyAxisAngle(yAxis, vehicleDirection);

  positions.push(front.add(position));
  positions.push(frontRightCorner.add(position));
  positions.push(right.add(position));
  positions.push(rightRearCorner.add(position));
  positions.push(rear.add(position));
  positions.push(rearLeftCorner.add(position));
  positions.push(left.add(position));
  positions.push(leftFrontCorner.add(position));

  const result = [];
  // Raycast in each direction and store the intersections
  for (let i = 0; i < 8; i++) {
    result.push(
      findNearestObject(
        scene,
        positions[i],
        directions[i],
        MAX_SENSING_DISTANCE
      )
    );
  }
  if (VisualMode.showSensing) {
    updateRayLines(result);
  }
  return result;
}

function findNearestObject(
  scene: THREE.Scene,
  position: THREE.Vector3,
  direction: THREE.Vector3,
  maxDistance: number
): DetectionResult {
  raycaster.set(position, direction.normalize());

  const intersects = raycaster.intersectObjects(scene.children, true);

  let nearestObject: THREE.Object3D | null = null;
  let nearestDistance = maxDistance;

  for (const intersection of intersects) {
    const object = intersection.object;
    const distance = intersection.distance;

    if (distance < nearestDistance && distance < maxDistance) {
      nearestObject = object;
      nearestDistance = distance;
    }
  }

  return {
    position,
    direction,
    object: nearestObject?.userData?.type,
    distance: nearestDistance
  };
}

function getHorizontalRotationAngle(quaternion: THREE.Quaternion): number {
  // Create a vector pointing in the forward direction (positive x-axis)
  const forwardVector = new THREE.Vector3(1, 0, 0);

  // Apply the quaternion rotation to the forward vector
  forwardVector.applyQuaternion(quaternion);

  // Calculate the horizontal angle between the rotated vector and the positive x-axis
  let horizontalAngle = Math.atan2(forwardVector.z, forwardVector.x) + Math.PI;

  // Ensure the angle is within [0, 2π]
  horizontalAngle =
    horizontalAngle < 0 ? horizontalAngle + 2 * Math.PI : horizontalAngle;

  return horizontalAngle;
}

export function createRayLines(scene: THREE.Scene) {
  // Create and add 8 ray lines to the scene
  for (let i = 0; i < 8; i++) {
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0390fc });
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(),
      new THREE.Vector3()
    ]);
    const rayLine = new THREE.Line(lineGeometry, lineMaterial);
    // It is always within camera, disable cull is more efficient than calling
    // computeSphere every time, but should change implementation if not true.
    rayLine.frustumCulled = false;
    scene.add(rayLine);
    rayLines.push(rayLine);
  }
}

function updateRayLines(detectionResults: DetectionResult[]) {
  for (let i = 0; i < 8; i++) {
    const result = detectionResults[i];

    const startPoint = result.position.clone();
    const endPoint = result.position
      .clone()
      .add(result.direction.clone().multiplyScalar(result.distance));
    const lineGeometry = rayLines[i].geometry as THREE.BufferGeometry;
    const positions = lineGeometry.attributes.position.array as Float32Array;

    // Update line geometry
    positions[0] = startPoint.x;
    positions[1] = startPoint.y;
    positions[2] = startPoint.z;
    positions[3] = endPoint.x;
    positions[4] = endPoint.y;
    positions[5] = endPoint.z;

    lineGeometry.attributes.position.needsUpdate = true;
  }
}
