import * as CANNON from "cannon-es";
import * as THREE from "three";
import { setPosition, setQuaternion } from "./Conversion";

const visuals: THREE.Group[] = [];
const bodies: CANNON.Body[] = [];

export function updateVisual() {
  visuals.forEach((visual, i) => {
    setPosition(visual, bodies[i].position);
    setQuaternion(visual, bodies[i].quaternion);
  });
}

export function addVisual(body: CANNON.Body, scene: THREE.Scene) {
  if (!(body instanceof CANNON.Body)) {
    throw new Error("The argument passed to addVisual() is not a body");
  }

  const material = new THREE.MeshNormalMaterial();
  material.wireframe = true;

  // get the correspondent three.js mesh
  const mesh = bodyToMesh(body, material);

  // enable shadows on every object
  mesh.traverse(child => {
    child.castShadow = true;
    child.receiveShadow = true;
  });

  bodies.push(body);
  visuals.push(mesh);

  scene.add(mesh);
}

/**
 * Converts a cannon.js body to a three.js mesh group
 * @param {Body} body The cannon.js body
 * @param {Material} material The material the mesh will have
 * @return {Group} The three.js mesh group
 */
function bodyToMesh(body: CANNON.Body, material: THREE.Material) {
  const group = new THREE.Group();

  setPosition(group, body.position);
  setQuaternion(group, body.quaternion);

  const meshes = body.shapes.map(shape => {
    const geometry = shapeToGeometry(shape);

    return new THREE.Mesh(geometry, material);
  });

  meshes.forEach((mesh, i) => {
    const offset = body.shapeOffsets[i];
    const orientation = body.shapeOrientations[i];
    setPosition(mesh, offset);
    setQuaternion(mesh, orientation);
    group.add(mesh);
  });

  return group;
}

/**
 * Converts a cannon.js shape to a three.js geometry
 * ⚠️ Warning: it will not work if the shape has been rotated
 * or scaled beforehand, for example with ConvexPolyhedron.transformAllPoints().
 * @param {Shape} shape The cannon.js shape
 * @param {Object} options The options of the conversion
 * @return {Geometry} The three.js geometry
 */
export function shapeToGeometry(shape: any, { flatShading = true } = {}) {
  switch (shape.type) {
    case CANNON.Shape.types.SPHERE: {
      return new THREE.SphereGeometry(shape.radius, 8, 8);
    }

    case CANNON.Shape.types.PARTICLE: {
      return new THREE.SphereGeometry(0.1, 8, 8);
    }

    case CANNON.Shape.types.PLANE: {
      return new THREE.PlaneGeometry(500, 500, 4, 4);
    }

    case CANNON.Shape.types.BOX: {
      return new THREE.BoxGeometry(
        shape.halfExtents.x * 2,
        shape.halfExtents.y * 2,
        shape.halfExtents.z * 2
      );
    }

    case CANNON.Shape.types.CYLINDER: {
      return new THREE.CylinderGeometry(
        shape.radiusTop,
        shape.radiusBottom,
        shape.height,
        shape.numSegments
      );
    }

    default: {
      throw new Error(`Shape not recognized: "${shape.type}"`);
    }
  }
}
