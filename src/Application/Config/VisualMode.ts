export enum CameraMode {
  NONE,
  FOLLOW,
  FOLLOW_BEHIND
}

export const VisualMode = {
  showModel: true,
  showBody: false,
  showGroundGrid: true,
  showSensing: true,
  cameraMode: CameraMode.FOLLOW
};
