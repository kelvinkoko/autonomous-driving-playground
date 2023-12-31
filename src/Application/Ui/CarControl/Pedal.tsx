import * as React from "react";
import { useRef } from "react";
import { getTouchPoint } from "../../Utils/TouchUtil";
import styles from "./Pedal.css";

interface Props {
  max: number;
  min: number;
  value: number;
  thumbImage: string;
  imageWidthPx: number;
  imageHeightPx: number;
  onChange?: (value: number) => void;
  setIsManualDriving: (value: boolean) => void;
}

const Pedal = ({
  max,
  min,
  value,
  thumbImage,
  imageWidthPx,
  imageHeightPx,
  onChange,
  setIsManualDriving
}: Props) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsManualDriving(true);
    handleDrag(e.clientY);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    handleDrag(e.clientY);
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    setIsManualDriving(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = getTouchPoint(e, sliderRef);
    if (!touch) {
      return;
    }
    setIsManualDriving(true);
    handleDrag(touch.clientY);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
  };

  const handleTouchMove = (e: TouchEvent) => {
    const touch = getTouchPoint(e, sliderRef);
    if (!touch) {
      return;
    }
    handleDrag(touch.clientY);
  };

  const handleTouchEnd = () => {
    document.removeEventListener("touchmove", handleTouchMove);
    document.removeEventListener("touchend", handleTouchEnd);
    setIsManualDriving(false);
  };

  const handleDrag = (clientY: number) => {
    if (sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect();
      const dragY = Math.min(
        Math.max(clientY, rect.top),
        rect.top + rect.height
      );
      const percentage = (dragY - rect.top) / rect.height;
      const newValue = min + (max - min) * percentage;
      if (onChange) {
        onChange(newValue);
      }
    }
  };

  const progressHeight = ((value - min) / (max - min)) * 100;
  const thumbPosition = progressHeight - 10; // Subtract half the height of the thumb for better positioning

  return (
    <div className={styles.verticalSlider} ref={sliderRef}>
      <div
        className={styles.sliderProgress}
        style={{ height: `${progressHeight}%` }}
      ></div>
      <div
        className={styles.sliderThumb}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        style={{
          width: `${imageWidthPx}px`,
          height: `${imageHeightPx}px`,
          top: `${thumbPosition}%`,
          backgroundImage: `url(${thumbImage})`
        }}
      ></div>
    </div>
  );
};

export default Pedal;
