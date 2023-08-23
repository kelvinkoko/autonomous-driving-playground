import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const loader = new GLTFLoader();

export function loadModel(
  url: string,
  progress?: (loaded: number, total: number) => void
): Promise<THREE.Group> {
  return new Promise((resolve, reject) => {
    loader.load(
      url,
      model => {
        resolve(model.scene);
      },
      xhr => {
        progress?.call(null, xhr.loaded, xhr.total);
      },
      error => {
        reject(error);
      }
    );
  });
}
