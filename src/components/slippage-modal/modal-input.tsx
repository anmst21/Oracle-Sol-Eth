import React, { useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import { SliderDots } from "../icons";

type Props = {};

const ModalInput = (props: Props) => {
  const [value, setValue] = useState<number>(2);
  const [isDragging, setIsDragging] = useState(false);
  console.log("isDragging", isDragging);
  return (
    <div className="modal-input">
      <label className="percentage-input">
        <input
          type="number"
          min={0}
          max={100}
          value={value}
          onChange={(e) => {
            let v = Number(e.target.value);
            if (v < 0) v = 0;
            if (v > 100) v = 100;
            setValue(v);
          }}
        />
        <span>%</span>
      </label>
      <div className="slider-wrapper">
        <Slider.Root
          className="SliderRoot"
          value={[value]}
          max={100}
          step={1}
          onValueChange={([v]) => setValue(v)}
          aria-label="Percentage"
        >
          <Slider.Track className="SliderTrack">
            <Slider.Range className="SliderRange" />
          </Slider.Track>
          <Slider.Thumb
            onPointerDown={() => setIsDragging(true)}
            onPointerUp={() => setIsDragging(false)}
            className="SliderThumb"
          >
            <SliderDots />
            {isDragging && <div className="slider-tooltip">{value}%</div>}
          </Slider.Thumb>
        </Slider.Root>

        <div className="slider-wrapper__status">
          <span>
            1<span className="grey">%</span>
          </span>

          <span>MAX</span>
        </div>
      </div>
    </div>
  );
};

export default ModalInput;
