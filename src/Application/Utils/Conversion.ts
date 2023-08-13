import * as CANNON from "cannon-es";
import * as THREE from "three";

export function setPosition(object: THREE.Object3D, position: CANNON.Vec3) {
  object.position.set(position.x, position.y, position.z);
}

export function setQuaternion(
  object: THREE.Object3D,
  quaternion: CANNON.Quaternion
) {
  object.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
}
