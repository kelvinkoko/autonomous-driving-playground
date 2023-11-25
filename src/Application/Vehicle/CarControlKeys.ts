export interface CarControlKeys {
  applyForceKey: string;
  applyBackwardForceKey: string;
  applyBreak: string;
  steerLeft: string;
  steerRight: string;
}

export const DEFAULT_KEYS_1: CarControlKeys = {
  applyForceKey: "w",
  applyBackwardForceKey: "s",
  applyBreak: "b",
  steerLeft: "a",
  steerRight: "d"
};

export const DEFAULT_KEYS_2: CarControlKeys = {
  applyForceKey: "ArrowUp",
  applyBackwardForceKey: "ArrowDown",
  applyBreak: " ",
  steerLeft: "ArrowLeft",
  steerRight: "ArrowRight"
};
