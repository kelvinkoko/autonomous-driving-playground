import * as CANNON from "cannon-es";
import { VisualMode } from "./Config/VisualMode";
import InfiniteGridHelper from "./Utils/InfiniteGridHelper";
import { addVisual } from "./Utils/Visual";

export const groundMaterial = new CANNON.Material("ground");

export function createGround(world: CANNON.World, scene: THREE.Scene) {
  const groundShape = new CANNON.Plane();
  const groundBody = new CANNON.Body({ mass: 0, material: groundMaterial });
  groundBody.addShape(groundShape);
  groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0); // make it face up

  world.addBody(groundBody);
  if (VisualMode.showGroundGrid) {
    const grid = new InfiniteGridHelper(1, 10);
    scene.add(grid);
  } else {
    addVisual(groundBody, scene);
  }
}
