import React, { ChangeEvent } from "react";
import { ModalChevDown } from "../icons";

type Props = {
  disabled: boolean;

  onSelectChange: (event: ChangeEvent<HTMLSelectElement>) => void;
};

function PaginationSwitch({ disabled, onSelectChange }: Props) {
  const options = [12, 24, 36, 48, 60];

  return (
    <label htmlFor="locale" className={"modal-switch"}>
      <span>Show:</span>
      <select
        disabled={disabled}
        onChange={onSelectChange}
        //   disabled={isPending}
        defaultValue={12}
        name="locale"
        id="locale"
      >
        {options.map((value) => {
          return (
            <option key={value} value={value}>
              {value}
            </option>
          );
        })}
      </select>
      <div className="lang-switch__chev">
        <ModalChevDown />
      </div>
    </label>
  );
}

export default PaginationSwitch;
