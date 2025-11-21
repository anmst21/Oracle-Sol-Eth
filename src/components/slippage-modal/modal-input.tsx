import React, { useCallback } from "react";
import * as Slider from "@radix-ui/react-slider";
import { SliderDots } from "../icons";
import GreenDot from "../green-dot";
import { useSlippage } from "@/context/SlippageContext";
import { AnimatePresence, motion } from "motion/react";

const ModalInput = () => {
  const { value, setValue, isDragging, setIsDragging } = useSlippage();
  // console.log("isDragging", isDragging);

  const splittedValue = value.toString().split(".");

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const parsed = parseFloat(e.target.value);
      if (isNaN(parsed)) return;
      // clamp 0–100, then round to two decimals
      const clamped = Math.min(Math.max(parsed, 0), 100);
      setValue(parseFloat(clamped.toFixed(2)));
    },
    [setValue]
  );

  const onSliderChange = useCallback(
    ([v]: [number]): void => {
      setValue(parseFloat(v.toFixed(2)));
    },
    [setValue]
  );

  const setDragging = useCallback(
    (value: boolean) => setIsDragging(value),
    [setIsDragging]
  );
  return (
    <div className="modal-input">
      <label className="percentage-input">
        <input
          type="number"
          step={0.01}
          min={0}
          max={100}
          value={value.toFixed(2)}
          onChange={onInputChange}
        />
        <span>%</span>
      </label>
      <div className="slider-wrapper">
        <Slider.Root
          className="SliderRoot"
          value={[value]}
          max={100}
          step={0.01}
          onValueChange={onSliderChange}
          aria-label="Percentage"
        >
          <Slider.Track className="SliderTrack">
            <Slider.Range className="SliderRange" />
          </Slider.Track>
          <Slider.Thumb
            onPointerDown={() => setDragging(true)}
            onPointerUp={() => setDragging(false)}
            className="SliderThumb"
          >
            <SliderDots />
            {isDragging && (
              <AnimatePresence mode="wait">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="slider-tooltip"
                >
                  <GreenDot int={splittedValue[0]} dec={splittedValue[1]} />%
                </motion.div>
              </AnimatePresence>
            )}
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
