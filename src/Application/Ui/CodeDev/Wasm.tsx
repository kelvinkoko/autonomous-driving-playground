import * as React from "react";
import * as THREE from "three";
import { DetectionResult } from "../../Simulation/Vehicle/DetectionResult";
import { DriveAction } from "../../Simulation/Vehicle/DriveAction";
import StoreContext from "../../Store/StoreContext";
import styles from "./Wasm.css";

export const Wasm = () => {
  const rootStore = React.useContext(StoreContext);
  const appStore = rootStore.applicationStore;

  const loadWasm = async (file: File) => {
    try {
      if (!file) {
        console.error("No file selected.");
        return;
      }

      const wasmBytes = await file.arrayBuffer();
      const { instance } = await WebAssembly.instantiate(wasmBytes);
      appStore.setWasmModule(instance);

      if (typeof instance.exports.drive !== "function") {
        console.error("The drive function is not defined in the wasm module.");
      }
    } catch (error) {
      console.error("Error loading the wasm module:", error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      loadWasm(files[0]);
    }
  };

  return (
    <div className={styles.container}>
      <div>
        <div className={styles.label}>Upload a Wasm file:</div>{" "}
        <input
          className={styles.uploadText}
          type="file"
          accept=".wasm"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export const runWasm = (wasmModule: any) => {
  console.log(wasmModule.exports.main());

  if (wasmModule && typeof wasmModule.exports.drive === "function") {
    const detectionResults: DetectionResult[] = [
      {
        position: new THREE.Vector3(0, 1, 2),
        direction: new THREE.Vector3(0, 1, 2),
        object: null,
        distance: 10
      }
      // Add more DetectionResult objects as needed
    ];

    const driveAction: DriveAction = wasmModule.exports.drive(detectionResults);

    // Access the properties of the DriveAction object
    const { force, brake, steering } = driveAction;

    // Use the drive action values as needed
    console.log("Force:", force);
    console.log("Brake:", brake);
    console.log("Steering:", steering);
  }
};
