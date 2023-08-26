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

export function toThreeQuaternion(
  cannonQuaternion: CANNON.Quaternion
): THREE.Quaternion {
  return new THREE.Quaternion(
    cannonQuaternion.x,
    cannonQuaternion.y,
    cannonQuaternion.z,
    cannonQuaternion.w
  );
}

export function toThreeVector3(vec3: CANNON.Vec3): THREE.Vector3 {
  return new THREE.Vector3(vec3.x, vec3.y, vec3.z);
}
