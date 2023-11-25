import * as THREE from "three";
import { DetectionObjectType } from "../Vehicle/DetectionObjectType";
import { SENSIBLE_OBJECT_LAYER } from "../Vehicle/DistanceSensing";
import {
  ROAD_BLOCK_SIZE,
  createBlock,
  createCurveRoad,
  createStraightRoad
} from "./Road";

export function createTrack(scene: THREE.Scene) {
  const track = [
    ["C4", "H", "H", "H", "H", "C1"],
    ["C3", "H", "H", "H", "C1", "V"],
    ["B", "B", "B", "B", "C3", "C2"]
  ];
  for (let y = 0; y < track.length; y++) {
    for (let x = 0; x < track[y].length; x++) {
      let road;
      switch (track[y][x]) {
        case "B":
          road = createBlock();
          break;
        case "H":
          road = createStraightRoad();
          break;
        case "V":
          road = createStraightRoad();
          road.rotateY(Math.PI / 2);
          break;
        case "C1":
          road = createCurveRoad();
          break;
        case "C2":
          road = createCurveRoad();
          road.rotateY(-Math.PI / 2);
          break;
        case "C3":
          road = createCurveRoad();
          road.rotateY(Math.PI);
          break;
        case "C4":
          road = createCurveRoad();
          road.rotateY(Math.PI / 2);
          break;
      }
      if (road) {
        road.userData.type = DetectionObjectType.TRACK;
        road.position.set(ROAD_BLOCK_SIZE * x, 0, ROAD_BLOCK_SIZE * y);
        road.layers.enable(SENSIBLE_OBJECT_LAYER);
        scene.add(road);
      }
    }
  }
}
