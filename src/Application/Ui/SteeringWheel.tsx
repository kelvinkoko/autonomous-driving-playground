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

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!wheelRef.current) return;

    const wheel = wheelRef.current;
    const rect = wheel.getBoundingClientRect();
    const center = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
    initialAngleRad = Math.atan2(e.clientY - center.y, e.clientX - center.x);
    initialSteeringRad = carStore.steeringRad;

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
    const currentAngleRad = Math.atan2(
      e.clientY - center.y,
      e.clientX - center.x
    );
    const differenceRad = currentAngleRad - initialAngleRad;

    carStore.setSteering(initialSteeringRad + differenceRad);
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
