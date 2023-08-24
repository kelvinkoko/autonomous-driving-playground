import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { VisualMode } from "../Config/VisualMode";

const loader = new GLTFLoader();

export function loadModel(
  url: string,
  progress?: (loaded: number, total: number) => void
): Promise<THREE.Group | undefined> {
  return new Promise((resolve, reject) => {
    if (!VisualMode.showModel) {
      resolve(undefined);
      return;
    }
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
