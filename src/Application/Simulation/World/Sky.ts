import * as THREE from "three";
import { Sky } from "three/examples/jsm/objects/Sky.js";

export function createSky(scene: THREE.Scene) {
  const sky = new Sky();
  sky.scale.setScalar(450000);

  const effectController = {
    turbidity: 10,
    rayleigh: 2,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.8,
    elevation: 13,
    azimuth: 0.25
  };

  const uniforms = sky.material.uniforms;
  uniforms["turbidity"].value = effectController.turbidity;
  uniforms["rayleigh"].value = effectController.rayleigh;
  uniforms["mieCoefficient"].value = effectController.mieCoefficient;
  uniforms["mieDirectionalG"].value = effectController.mieDirectionalG;
  uniforms["mieDirectionalG"].value = effectController.mieDirectionalG;
  uniforms["mieDirectionalG"].value = effectController.mieDirectionalG;
  const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
  const theta = THREE.MathUtils.degToRad(effectController.azimuth);
  const sun = new THREE.Vector3();
  sun.setFromSphericalCoords(1, phi, theta);
  uniforms["sunPosition"].value.copy(sun);
  scene.add(sky);
}
