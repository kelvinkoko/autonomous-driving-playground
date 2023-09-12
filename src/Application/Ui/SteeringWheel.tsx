import { observer } from "mobx-react";
import * as React from "react";
import SteeringWheelImage from "../Assets/Images/steering-wheel.png";
import StoreContext from "../Store/StoreContext";

const SteeringWheel = observer(() => {
  const rootStore = React.useContext(StoreContext);
  const carStore = rootStore.carStore;

  const wheelRef = React.useRef<HTMLDivElement>(null);
  let initialAngleRad = 0;
  let initialSteeringRad = 0; // Store the initial steering wheel angle

  const handleStart = (clientX: number, clientY: number) => {
    if (!wheelRef.current) return;

    const wheel = wheelRef.current;
    const rect = wheel.getBoundingClientRect();
    const center = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
    initialAngleRad = Math.atan2(clientY - center.y, clientX - center.x);
    initialSteeringRad = carStore.steeringRad;

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!wheelRef.current) return;

    const wheel = wheelRef.current;
    const rect = wheel.getBoundingClientRect();
    const center = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
    const currentAngleRad = Math.atan2(clientY - center.y, clientX - center.x);
    const differenceRad = currentAngleRad - initialAngleRad;

    carStore.setSteering(initialSteeringRad + differenceRad);
  };

  const handleEnd = () => {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleEnd);
    window.removeEventListener("touchmove", handleTouchMove);
    window.removeEventListener("touchend", handleTouchEnd);
  };

  const handleMouseMove = (e: MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    handleStart(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: TouchEvent) => {
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div
      ref={wheelRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onDragStart={handleDragStart}
    >
      <img
        src={SteeringWheelImage}
        style={{
          transform: `rotate(${carStore.steeringRad}rad)`
        }}
      />
    </div>
  );
});

export default SteeringWheel;
