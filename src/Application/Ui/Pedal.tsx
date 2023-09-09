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
  let isDragging = false;

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDragging = true;
    handleDrag(e.clientY);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      handleDrag(e.clientY);
    }
  };

  const handleMouseUp = () => {
    isDragging = false;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  const handleDrag = (clientY: number) => {
    if (sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect();
      const percentage = (clientY - rect.top) / rect.height;
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
