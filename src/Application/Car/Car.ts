import * as CANNON from "cannon-es";
import chassisModelFile from "../Assets/Models/chassis.gltf";
import chassisLowResModelFile from "../Assets/Models/model3-chassis-low.glb";
import wheelModelFile from "../Assets/Models/wheel.glb";

import { observe } from "mobx";
import * as THREE from "three";
import { groundMaterial } from "../Ground";
import { CarStore } from "../Store/CarStore";
import { loadModel } from "../Utils/Loader";
import { addVisual, pushVisual } from "../Utils/Visual";
import { CarControlKeys } from "./CarControlKeys";

export const model3HighRes: CarConfig = {
  chassisModel: chassisModelFile,
  weight: 1611,
  length: 4.694,
  width: 2.088,
  overallHeight: 1.445,
  groundClearance: 0.14,
  chassisHeight: 1.445 - 0.14,
  wheelRadius: 0.3353,
  overhangFront: 0.841 - 0.06, // 0.06 is just adjust visually
  overhangRear: 0.978 + 0.06,
  track: 1.58
};
export const model3LowRes: CarConfig = {
  chassisModel: chassisLowResModelFile,
  weight: 1611,
  length: 4.694,
  width: 2.088,
  overallHeight: 1.445,
  groundClearance: 0.14,
  chassisHeight: 1.445 - 0.14,
  wheelRadius: 0.3353,
  overhangFront: 0.841,
  overhangRear: 0.978,
  track: 1.58
};

const MAX_STEER = 0.5;
export const MAX_FORCE = 1331;
export const MAX_BREAK_FORCE = 100;

export interface CarConfig {
  chassisModel: string;
  weight: number;
  length: number;
  width: number;
  overallHeight: number;
  groundClearance: number;
  chassisHeight: number;
  wheelRadius: number;
  overhangFront: number;
  overhangRear: number;
  track: number;
}

export async function createVehicle(
  position: CANNON.Vec3,
  controlKeys: CarControlKeys,
  world: CANNON.World,
  scene: THREE.Scene,
  carStore: CarStore,
  currentCarModel: CarConfig
): Promise<CANNON.RaycastVehicle> {
  const chassisModel = await loadModel(currentCarModel.chassisModel);
  const wheelModel = await loadModel(wheelModelFile);

  const vehicle = setupChassis(position, scene, currentCarModel, chassisModel);
  setupWheels(vehicle, world, scene, currentCarModel, wheelModel);

  vehicle.addToWorld(world);

  observeStore(carStore, vehicle);
  bindKeyEvent(vehicle, controlKeys, carStore);
  return vehicle;
}

function observeStore(carStore: CarStore, vehicle: CANNON.RaycastVehicle) {
  observe(carStore, "steeringRad", change => {
    vehicle.setSteeringValue(-change.newValue, 0);
    vehicle.setSteeringValue(-change.newValue, 1);
  });
  observe(carStore, "applyingForce", change => {
    vehicle.applyEngineForce(-change.newValue, 2);
    vehicle.applyEngineForce(-change.newValue, 3);
  });
  observe(carStore, "applyingBrake", change => {
    vehicle.setBrake(change.newValue, 0);
    vehicle.setBrake(change.newValue, 1);
    vehicle.setBrake(change.newValue, 2);
    vehicle.setBrake(change.newValue, 3);
  });
}

function setupChassis(
  position: CANNON.Vec3,
  scene: THREE.Scene,
  currentCarModel: CarConfig,
  chassisModel?: THREE.Group
): CANNON.RaycastVehicle {
  const chassisBoxSize = getChassisSize(currentCarModel, chassisModel);
  const chassisShape = new CANNON.Box(
    new CANNON.Vec3(
      chassisBoxSize.x / 2,
      chassisBoxSize.y / 2 - currentCarModel.groundClearance / 2,
      chassisBoxSize.z / 2
    )
  );
  const chassisBody = new CANNON.Body({ mass: currentCarModel.weight });
  chassisBody.addShape(chassisShape);
  chassisBody.position.copy(position);
  chassisBody.quaternion.setFromEuler(0, Math.PI, 0);
  addVisual(chassisBody, scene);
  if (chassisModel) {
    pushVisual(chassisBody, chassisModel, scene);
  }
  const vehicle = new CANNON.RaycastVehicle({
    chassisBody
  });
  return vehicle;
}

function getChassisSize(
  currentCarModel: CarConfig,
  chassisModel?: THREE.Group
): THREE.Vector3 {
  if (chassisModel) {
    let chassisBoxSize = getBoundingBoxSize(chassisModel);
    const scale = currentCarModel.length / chassisBoxSize.x;
    chassisModel.scale.set(scale, scale, scale);
    return getBoundingBoxSize(chassisModel);
  } else {
    return new THREE.Vector3(
      currentCarModel.length,
      currentCarModel.chassisHeight,
      currentCarModel.width
    );
  }
}

function setupWheels(
  vehicle: CANNON.RaycastVehicle,
  world: CANNON.World,
  scene: THREE.Scene,
  currentCarModel: CarConfig,
  wheelModel?: THREE.Group
) {
  setupWheelsInfo(vehicle, currentCarModel);

  const wheelMaterial = new CANNON.Material("wheel");
  const wheelBodies: CANNON.Body[] = [];
  for (let i = 0; i < 4; i++) {
    const wheelInfo = vehicle.wheelInfos[i];
    const wheelBody = createWheelBody(i, wheelInfo, wheelMaterial);
    wheelBodies.push(wheelBody);
    addVisual(wheelBody, scene);
    world.addBody(wheelBody);

    if (wheelModel) {
      const clonedWheelModel = cloneWheelModel(i, wheelInfo, wheelModel);
      pushVisual(wheelBody, clonedWheelModel, scene);
    }
  }

  const wheelGround = new CANNON.ContactMaterial(
    wheelMaterial,
    groundMaterial,
    {
      friction: 0.3,
      restitution: 0,
      contactEquationStiffness: 1000
    }
  );
  world.addContactMaterial(wheelGround);

  // Update the wheel bodies
  world.addEventListener("postStep", () => {
    for (let i = 0; i < vehicle.wheelInfos.length; i++) {
      vehicle.updateWheelTransform(i);
      const transform = vehicle.wheelInfos[i].worldTransform;
      const wheelBody = wheelBodies[i];
      wheelBody.position.copy(transform.position);
      wheelBody.quaternion.copy(transform.quaternion);
    }
  });
}

function setupWheelsInfo(
  vehicle: CANNON.RaycastVehicle,
  currentCarModel: CarConfig
) {
  const vehicleBody = vehicle.chassisBody;
  const OVERALL_HEIGHT =
    vehicleBody.aabb.upperBound.y - vehicleBody.aabb.lowerBound.y;
  const wheelOptions = {
    radius: currentCarModel.wheelRadius,
    directionLocal: new CANNON.Vec3(0, -1, 0),
    suspensionStiffness: 30,
    // Cannot find from spec, assume it contribute half clearance
    suspensionRestLength: currentCarModel.groundClearance,
    frictionSlip: 1.4,
    dampingRelaxation: 2.3,
    dampingCompression: 4.4,
    maxSuspensionForce: 100000,
    rollInfluence: 0.01,
    axleLocal: new CANNON.Vec3(0, 0, 1),
    chassisConnectionPointLocal: new CANNON.Vec3(-1, 0, 1),
    maxSuspensionTravel: 0.3,
    customSlidingRotationalSpeed: -30,
    useCustomSlidingRotationalSpeed: true
  };
  const xFrontPosition =
    currentCarModel.length / 2 - currentCarModel.overhangFront;
  const xRearPosition =
    currentCarModel.length / 2 - currentCarModel.overhangRear;
  const yOffset = -(
    OVERALL_HEIGHT / 2 -
    currentCarModel.wheelRadius +
    currentCarModel.groundClearance
  );
  const zOffset = currentCarModel.track / 2;

  wheelOptions.chassisConnectionPointLocal.set(
    -xFrontPosition,
    yOffset,
    zOffset
  );
  vehicle.addWheel(wheelOptions);

  wheelOptions.chassisConnectionPointLocal.set(
    -xFrontPosition,
    yOffset,
    -zOffset
  );
  vehicle.addWheel(wheelOptions);

  wheelOptions.chassisConnectionPointLocal.set(xRearPosition, yOffset, zOffset);
  vehicle.addWheel(wheelOptions);

  wheelOptions.chassisConnectionPointLocal.set(
    xRearPosition,
    yOffset,
    -zOffset
  );
  vehicle.addWheel(wheelOptions);
}

function createWheelBody(
  i: number,
  wheel: CANNON.WheelInfo,
  wheelMaterial: CANNON.Material
): CANNON.Body {
  const cylinderShape = new CANNON.Cylinder(
    wheel.radius,
    wheel.radius,
    0.235,
    20
  );
  const wheelBody = new CANNON.Body({
    mass: 0,
    material: wheelMaterial
  });
  wheelBody.type = CANNON.Body.KINEMATIC;
  wheelBody.collisionFilterGroup = 0; // turn off collisions
  const quaternion = new CANNON.Quaternion().setFromEuler(-Math.PI / 2, 0, 0);
  wheelBody.addShape(cylinderShape, new CANNON.Vec3(), quaternion);
  return wheelBody;
}

function cloneWheelModel(
  i: number,
  wheel: CANNON.WheelInfo,
  glthWheelModel: THREE.Group
): THREE.Group {
  const clonedModel = glthWheelModel.clone();
  const boxSize = getBoundingBoxSize(clonedModel);
  const wheelScale = wheel.radius / (boxSize.x / 2);
  if (i === 1 || i === 3) {
    clonedModel.scale.set(-wheelScale, wheelScale, -wheelScale);
  } else {
    clonedModel.scale.set(wheelScale, wheelScale, wheelScale);
  }
  return clonedModel;
}

function getBoundingBoxSize(model: THREE.Group): THREE.Vector3 {
  const box = new THREE.Box3().setFromObject(model);
  return box.getSize(new THREE.Vector3());
}

function bindKeyEvent(
  vehicle: CANNON.RaycastVehicle,
  keys: CarControlKeys,
  carStore: CarStore
) {
  // Add force on keydown
  document.addEventListener("keydown", event => {
    switch (event.key) {
      case keys.applyForceKey:
        carStore.applyForce(MAX_FORCE);
        break;

      case keys.applyBackwardForceKey:
        carStore.applyForce(-MAX_FORCE);
        break;

      case keys.steerLeft:
        carStore.setSteering(-MAX_STEER);
        break;

      case keys.steerRight:
        carStore.setSteering(MAX_STEER);
        break;

      case keys.applyBreak:
        carStore.applyBrake(MAX_BREAK_FORCE);
        break;
    }
  });

  // Reset force on keyup
  document.addEventListener("keyup", event => {
    switch (event.key) {
      case "w":
      case "ArrowUp":
        carStore.applyForce(0);
        break;

      case "s":
      case "ArrowDown":
        carStore.applyForce(0);
        break;

      case "a":
      case "ArrowLeft":
        carStore.setSteering(0);
        break;

      case "d":
      case "ArrowRight":
        carStore.setSteering(0);
        break;

      case "b":
        carStore.applyBrake(0);
        break;
    }
  });
}
