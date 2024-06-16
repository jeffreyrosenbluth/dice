import React, { useState } from "react";

interface ToggleProps {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({
  label,
  checked = false,
  onChange,
}) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleChange = () => {
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    if (onChange) {
      onChange(newChecked);
    }
  };

  return (
    <div className="flex items-center">
      <input
        id={`toggle-${label}`}
        type="checkbox"
        className="sr-only"
        checked={isChecked}
        onChange={handleChange}
      />
      <label
        htmlFor={`toggle-${label}`}
        className={`relative inline-flex h-6 w-11 items-center rounded-full bg-gray-400 transition ${
          isChecked ? "bg-blue-600" : ""
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
            isChecked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </label>
      {label && <span className="ml-2 text-slate-200">{label}</span>}
    </div>
  );
};

export default Toggle;
