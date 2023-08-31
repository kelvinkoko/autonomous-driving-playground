import * as CANNON from "cannon-es";
import chassisModelFile from "../Assets/Models/chassis.gltf";
import wheelModelFile from "../Assets/Models/wheel.glb";

import * as THREE from "three";
import { groundMaterial } from "../Ground";
import { loadModel } from "../Utils/Loader";
import { addVisual, pushVisual } from "../Utils/Visual";
import { CarControlKeys } from "./CarControlKeys";

const WEIGHT = 1611;
const LENGTH = 4.694;
const WIDTH = 2.088;
const OVERALL_HEIGHT = 1.445;
const GROUND_CLEARANCE = 0.14;
const CHASSIS_HEIGHT = OVERALL_HEIGHT - GROUND_CLEARANCE;
const WHEEL_RADIUS = 0.3353;
const overhang_offset = 0.06; // this is just adjust visually
const OVERHANG_FRONT = 0.841 - overhang_offset;
const OVERHANG_REAR = 0.978 + overhang_offset;
const TRACK = 1.58;

export async function createVehicle(
  position: CANNON.Vec3,
  controlKeys: CarControlKeys,
  world: CANNON.World,
  scene: THREE.Scene
): Promise<CANNON.RaycastVehicle> {
  const chassisModel = await loadModel(chassisModelFile);
  const wheelModel = await loadModel(wheelModelFile);

  const vehicle = setupChassis(position, scene, chassisModel);
  setupWheels(vehicle, world, scene, wheelModel);

  vehicle.addToWorld(world);
  bindKeyEvent(vehicle, controlKeys);
  return vehicle;
}

function setupChassis(
  position: CANNON.Vec3,
  scene: THREE.Scene,
  chassisModel?: THREE.Group
): CANNON.RaycastVehicle {
  const chassisBoxSize = getChassisSize(chassisModel);
  const chassisShape = new CANNON.Box(
    new CANNON.Vec3(
      chassisBoxSize.x / 2,
      chassisBoxSize.y / 2 - GROUND_CLEARANCE / 2,
      chassisBoxSize.z / 2
    )
  );
  const chassisBody = new CANNON.Body({ mass: WEIGHT });
  chassisBody.addShape(chassisShape);
  chassisBody.position.copy(position);
  chassisBody.quaternion.setFromEuler(0, -Math.PI / 2, 0);
  addVisual(chassisBody, scene);
  if (chassisModel) {
    pushVisual(chassisBody, chassisModel, scene);
  }
  const vehicle = new CANNON.RaycastVehicle({
    chassisBody
  });
  return vehicle;
}

function getChassisSize(chassisModel?: THREE.Group): THREE.Vector3 {
  if (chassisModel) {
    let chassisBoxSize = getBoundingBoxSize(chassisModel);
    const scale = LENGTH / chassisBoxSize.x;
    chassisModel.scale.set(scale, scale, scale);
    return getBoundingBoxSize(chassisModel);
  } else {
    return new THREE.Vector3(LENGTH, CHASSIS_HEIGHT, WIDTH);
  }
}

function setupWheels(
  vehicle: CANNON.RaycastVehicle,
  world: CANNON.World,
  scene: THREE.Scene,
  wheelModel?: THREE.Group
) {
  setupWheelsInfo(vehicle);

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

function setupWheelsInfo(vehicle: CANNON.RaycastVehicle) {
  const vehicleBody = vehicle.chassisBody;
  const OVERALL_HEIGHT =
    vehicleBody.aabb.upperBound.y - vehicleBody.aabb.lowerBound.y;
  const CHASSIS_HEIGHT = OVERALL_HEIGHT - GROUND_CLEARANCE;
  const wheelOptions = {
    radius: WHEEL_RADIUS,
    directionLocal: new CANNON.Vec3(0, -1, 0),
    suspensionStiffness: 30,
    // Cannot find from spec, assume it contribute half clearance
    suspensionRestLength: GROUND_CLEARANCE,
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
  const xFrontPosition = LENGTH / 2 - OVERHANG_FRONT;
  const xRearPosition = LENGTH / 2 - OVERHANG_REAR;
  const yOffset = -(OVERALL_HEIGHT / 2 - WHEEL_RADIUS + GROUND_CLEARANCE);
  const zOffset = TRACK / 2;

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

function bindKeyEvent(vehicle: CANNON.RaycastVehicle, keys: CarControlKeys) {
  // Add force on keydown
  document.addEventListener("keydown", event => {
    const maxSteerVal = 0.5;
    const maxForce = 1331;
    const frontBrakeForce = 100;
    const rearBrakeForce = 100;

    switch (event.key) {
      case keys.applyForceKey:
        vehicle.applyEngineForce(-maxForce, 2);
        vehicle.applyEngineForce(-maxForce, 3);
        break;

      case keys.applyBackwardForceKey:
        vehicle.applyEngineForce(maxForce, 2);
        vehicle.applyEngineForce(maxForce, 3);
        break;

      case keys.steerLeft:
        vehicle.setSteeringValue(maxSteerVal, 0);
        vehicle.setSteeringValue(maxSteerVal, 1);
        break;

      case keys.steerRight:
        vehicle.setSteeringValue(-maxSteerVal, 0);
        vehicle.setSteeringValue(-maxSteerVal, 1);
        break;

      case keys.applyBreak:
        vehicle.setBrake(frontBrakeForce, 0);
        vehicle.setBrake(frontBrakeForce, 1);
        vehicle.setBrake(rearBrakeForce, 2);
        vehicle.setBrake(rearBrakeForce, 3);
        break;
    }
  });

  // Reset force on keyup
  document.addEventListener("keyup", event => {
    switch (event.key) {
      case "w":
      case "ArrowUp":
        vehicle.applyEngineForce(0, 2);
        vehicle.applyEngineForce(0, 3);
        break;

      case "s":
      case "ArrowDown":
        vehicle.applyEngineForce(0, 2);
        vehicle.applyEngineForce(0, 3);
        break;

      case "a":
      case "ArrowLeft":
        vehicle.setSteeringValue(0, 0);
        vehicle.setSteeringValue(0, 1);
        break;

      case "d":
      case "ArrowRight":
        vehicle.setSteeringValue(0, 0);
        vehicle.setSteeringValue(0, 1);
        break;

      case "b":
        vehicle.setBrake(0, 0);
        vehicle.setBrake(0, 1);
        vehicle.setBrake(0, 2);
        vehicle.setBrake(0, 3);
        break;
    }
  });
}