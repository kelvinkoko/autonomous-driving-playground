import * as React from "react";
import { useRef, useState } from "react";
import styles from "./Pedal.css";

interface Props {
  max: number;
  min: number;
  thumbImage: string;
  imageWidthPx: number;
  imageHeightPx: number;
  onChange?: (value: number) => void;
}

const Pedal = ({
  max,
  min,
  thumbImage,
  imageWidthPx,
  imageHeightPx,
  onChange
}: Props) => {
  const [value, setValue] = useState(min);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    handleDrag(e.clientY);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    handleDrag(e.clientY);
  };

  const handleMouseUp = () => {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    handleDrag(touch.clientY);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);
  };

  const handleTouchMove = (e: TouchEvent) => {
    const touch = e.touches[0];
    handleDrag(touch.clientY);
  };

  const handleTouchEnd = () => {
    window.removeEventListener("touchmove", handleTouchMove);
    window.removeEventListener("touchend", handleTouchEnd);
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
      setValue(Math.min(Math.max(newValue, min), max));
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
