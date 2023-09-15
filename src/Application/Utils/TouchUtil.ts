export const getTouchPoint = (
  e: React.TouchEvent<HTMLDivElement> | TouchEvent,
  touchableElement: React.RefObject<HTMLDivElement>
): React.Touch | undefined => {
  for (let i = 0; i < e.touches.length; i++) {
    const touch = e.touches[i];
    if (
      touchableElement.current &&
      touchableElement.current.contains(
        document.elementFromPoint(touch.clientX, touch.clientY)
      )
    ) {
      return touch;
    }
  }
  return undefined;
};
