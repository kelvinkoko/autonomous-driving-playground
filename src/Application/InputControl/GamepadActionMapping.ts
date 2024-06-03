import { CarStore } from "../Store/CarStore";
import { registerGamepadAction } from "./Gamepad";

const STEERING_AXIS_INDEX = 0;
const THROTTLE_AXIS_INDEX = 1;

export function setupGamepad(carStore: CarStore) {
  registerGamepadAction(0, {
    buttons: new Map(),
    axes: new Map([
      [
        STEERING_AXIS_INDEX,
        value => {
          carStore.setSteering(value);
        }
      ],
      [
        THROTTLE_AXIS_INDEX,
        value => {
          // For my controller move upward is negative, so negate the value
          carStore.applyForce(-value);
        }
      ]
    ])
  });
}
