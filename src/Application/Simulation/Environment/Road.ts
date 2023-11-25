import * as THREE from "three";
import { CSG } from "three-csg-ts";

const material = new THREE.MeshStandardMaterial();

export const ROAD_BLOCK_SIZE = 10;
const BOUNDARY_WIDTH = ROAD_BLOCK_SIZE / 8;
const BLOCK_HEIGHT = 0.1;

export function createBlock() {
  const planeGeometry = new THREE.BoxGeometry(
    ROAD_BLOCK_SIZE,
    BLOCK_HEIGHT,
    ROAD_BLOCK_SIZE
  );
  return new THREE.Mesh(planeGeometry, material);
}

export function createStraightRoad() {
  const planeGeometry = new THREE.BoxGeometry(
    ROAD_BLOCK_SIZE,
    BLOCK_HEIGHT,
    ROAD_BLOCK_SIZE
  );
  const plane = new THREE.Mesh(planeGeometry, material);
  const ROAD_WIDTH = ROAD_BLOCK_SIZE - BOUNDARY_WIDTH * 2;
  const roadGeometry = new THREE.BoxGeometry(
    ROAD_BLOCK_SIZE,
    BLOCK_HEIGHT,
    ROAD_WIDTH
  );
  const road = new THREE.Mesh(roadGeometry, material);
  return CSG.subtract(plane, road);
}

export function createCurveRoad() {
  const planeGeometry = new THREE.BoxGeometry(
    ROAD_BLOCK_SIZE,
    BLOCK_HEIGHT,
    ROAD_BLOCK_SIZE
  );
  const plane = new THREE.Mesh(planeGeometry, material);
  const largeRadius = ROAD_BLOCK_SIZE - BOUNDARY_WIDTH;
  const largeCylinderGeometry = new THREE.CylinderGeometry(
    largeRadius,
    largeRadius,
    BLOCK_HEIGHT,
    64
  );
  const largeCylinder = new THREE.Mesh(largeCylinderGeometry, material);
  largeCylinder.position.set(-ROAD_BLOCK_SIZE / 2, 0, ROAD_BLOCK_SIZE / 2);
  const smallRadius = BOUNDARY_WIDTH;
  const smallCylinderGeometry = new THREE.CylinderGeometry(
    smallRadius,
    smallRadius,
    BLOCK_HEIGHT,
    32
  );
  const smallCylinder = new THREE.Mesh(smallCylinderGeometry, material);
  smallCylinder.position.set(-ROAD_BLOCK_SIZE / 2, 0, ROAD_BLOCK_SIZE / 2);
  plane.updateMatrix();
  largeCylinder.updateMatrix();
  smallCylinder.updateMatrix();
  const curveMesh = CSG.subtract(largeCylinder, smallCylinder);
  const mesh = CSG.subtract(plane, curveMesh);
  return mesh;
}
