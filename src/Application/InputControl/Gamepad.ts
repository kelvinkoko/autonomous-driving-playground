/**
 * This module provides functionality for handling gamepad input in a web application.
 * It allows registering specific actions to be performed when certain buttons are pressed or
 * axes are moved on a gamepad. The module uses the Gamepad API to poll connected gamepads and
 * process their inputs accordingly.
 */

const gamepadActions = new Map<number, GamepadAction>();

/**
 * Polls the connected gamepads and processes their inputs based on registered actions.
 */
export function pollGamepads() {
  const gamepads = getGamepadsSafely();

  for (let i = 0; i < gamepads.length; i++) {
    const gamepad = gamepads[i];
    const action = gamepadActions.get(i);
    if (gamepad && action) {
      // Process the gamepad input
      processGamepadInput(gamepad, action);
    }
  }
}

/**
 * Safely retrieves the list of connected gamepads.
 *
 * @returns An array of connected gamepads, or an empty array if not supported.
 */
function getGamepadsSafely(): (Gamepad | null)[] {
  if (navigator.getGamepads) {
    return navigator.getGamepads();
  } else {
    console.warn("Gamepad API not supported in this browser.");
    return [];
  }
}

/**
 * Processes the input from a specific gamepad based on the provided actions.
 *
 * @param gamepad - The gamepad whose inputs are to be processed.
 * @param actions - The actions to be executed for each button and axis of the gamepad.
 */
function processGamepadInput(gamepad: Gamepad, actions: GamepadAction) {
  // Process button inputs
  processButtons(gamepad, actions);

  // Process axis inputs
  processAxes(gamepad, actions);
}

/**
 * Processes button inputs from the gamepad.
 *
 * @param gamepad - The gamepad whose buttons are to be processed.
 * @param actions - The actions to be executed for each button.
 */
function processButtons(gamepad: Gamepad, actions: GamepadAction) {
  gamepad.buttons.forEach((button, index) => {
    const action = actions.buttons.get(index);
    if (action) {
      try {
        action(button);
      } catch (error) {
        console.error(`Error processing button ${index}:`, error);
      }
    }
  });
}

/**
 * Processes axis inputs from the gamepad.
 *
 * @param gamepad - The gamepad whose axes are to be processed.
 * @param actions - The actions to be executed for each axis.
 */
function processAxes(gamepad: Gamepad, actions: GamepadAction) {
  gamepad.axes.forEach((axis, index) => {
    const action = actions.axes.get(index);
    if (action) {
      try {
        action(axis);
      } catch (error) {
        console.error(`Error processing axis ${index}:`, error);
      }
    }
  });
}

/**
 * Interface defining the structure of actions associated with gamepad buttons and axes.
 */
interface GamepadAction {
  buttons: Map<number, (button: GamepadButton) => void>;
  axes: Map<number, (axisValue: number) => void>;
}

/**
 * Registers actions for a specific gamepad.
 *
 * @param gamepadIndex - The index of the gamepad to associate with the actions.
 * @param action - The actions to be executed for the gamepad's buttons and axes.
 */
export function registerGamepadAction(
  gamepadIndex: number,
  action: GamepadAction
) {
  gamepadActions.set(gamepadIndex, action);
}
