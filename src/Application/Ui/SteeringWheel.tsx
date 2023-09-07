import { observer } from "mobx-react";
import * as React from "react";
import SteeringWheelImage from "../Assets/Images/steering-wheel.png";
import { CarStore } from "../Store/CarStore";

interface Props {
  carStore: CarStore;
}

const SteeringWheel = observer(({ carStore }: Props) => {
  const wheelRef = React.useRef<HTMLDivElement>(null);
  let initialAngleRad = 0;

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!wheelRef.current) return;

    const wheel = wheelRef.current;
    const rect = wheel.getBoundingClientRect();
    const center = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
    initialAngleRad =
      Math.atan2(e.clientY - center.y, e.clientX - center.x) * (180 / Math.PI) -
      carStore.steeringRad;

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!wheelRef.current) return;

    const wheel = wheelRef.current;
    const rect = wheel.getBoundingClientRect();
    const center = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
    const angleRad = Math.atan2(e.clientY - center.y, e.clientX - center.x);
    carStore.steeringRad = angleRad;
  };

  const handleMouseUp = () => {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div
      ref={wheelRef}
      className="steering-wheel"
      onMouseDown={handleMouseDown}
      onDragStart={handleDragStart}
      style={{ transform: `rotate(${carStore.steeringRad}rad)` }}
    >
      <img src={SteeringWheelImage} />
    </div>
  );
});

export default SteeringWheel;
