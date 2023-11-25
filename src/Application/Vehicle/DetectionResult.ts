import * as THREE from "three";
import { DetectionObjectType } from "./DetectionObjectType";

export interface DetectionResult {
  // Position of the position of the ray
  position: THREE.Vector3;
  // Direction vector of the ray cast to
  direction: THREE.Vector3;
  // object detected
  object: DetectionObjectType | null;
  // distance of that object
  distance: number;
}
