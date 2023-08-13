import * as CANNON from "cannon-es";
import { groundMaterial } from "./Ground";
import { addVisual } from "./Utils/Visual";

export function createVehicle(world: CANNON.World, scene: THREE.Scene) {
  const chassisBody = setupChassis(scene);

  const vehicle = new CANNON.RaycastVehicle({
    chassisBody
  });

  setupWheels(vehicle, world, scene);

  vehicle.addToWorld(world);

  bindKeyEvent(vehicle);
}

function setupChassis(scene: THREE.Scene) {
  const chassisShape = new CANNON.Box(new CANNON.Vec3(2, 0.5, 1));
  const chassisBody = new CANNON.Body({ mass: 150 });
  chassisBody.addShape(chassisShape);
  chassisBody.position.set(0, 4, 0);
  chassisBody.quaternion.setFromEuler(0, -Math.PI / 2, 0);
  addVisual(chassisBody, scene);
  return chassisBody;
}

function setupWheels(
  vehicle: CANNON.RaycastVehicle,
  world: CANNON.World,
  scene: THREE.Scene
) {
  const wheelOptions = {
    radius: 0.5,
    directionLocal: new CANNON.Vec3(0, -1, 0),
    suspensionStiffness: 30,
    suspensionRestLength: 0.3,
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

  wheelOptions.chassisConnectionPointLocal.set(-1, 0, 1);
  vehicle.addWheel(wheelOptions);

  wheelOptions.chassisConnectionPointLocal.set(-1, 0, -1);
  vehicle.addWheel(wheelOptions);

  wheelOptions.chassisConnectionPointLocal.set(1, 0, 1);
  vehicle.addWheel(wheelOptions);

  wheelOptions.chassisConnectionPointLocal.set(1, 0, -1);
  vehicle.addWheel(wheelOptions);

  // Add the wheel bodies
  const wheelBodies: CANNON.Body[] = [];
  const wheelMaterial = new CANNON.Material("wheel");
  vehicle.wheelInfos.forEach(wheel => {
    const cylinderShape = new CANNON.Cylinder(
      wheel.radius,
      wheel.radius,
      wheel.radius / 2,
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
    wheelBodies.push(wheelBody);
    addVisual(wheelBody, scene);
    world.addBody(wheelBody);
  });

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

  return wheelBodies;
}

function bindKeyEvent(vehicle: CANNON.RaycastVehicle) {
  // Add force on keydown
  document.addEventListener("keydown", event => {
    const maxSteerVal = 0.5;
    const maxForce = 1000;
    const brakeForce = 1000000;

    switch (event.key) {
      case "w":
      case "ArrowUp":
        vehicle.applyEngineForce(-maxForce, 2);
        vehicle.applyEngineForce(-maxForce, 3);
        break;

      case "s":
      case "ArrowDown":
        vehicle.applyEngineForce(maxForce, 2);
        vehicle.applyEngineForce(maxForce, 3);
        break;

      case "a":
      case "ArrowLeft":
        vehicle.setSteeringValue(maxSteerVal, 0);
        vehicle.setSteeringValue(maxSteerVal, 1);
        break;

      case "d":
      case "ArrowRight":
        vehicle.setSteeringValue(-maxSteerVal, 0);
        vehicle.setSteeringValue(-maxSteerVal, 1);
        break;

      case "b":
        vehicle.setBrake(brakeForce, 0);
        vehicle.setBrake(brakeForce, 1);
        vehicle.setBrake(brakeForce, 2);
        vehicle.setBrake(brakeForce, 3);
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
