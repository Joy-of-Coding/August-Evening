import React, { useState, useEffect } from "react";
import { LocalStorage } from "./LocalStorage";

export interface DatePickerProps {
  label?: string;
  value?: string;
  onChange?: (date: string) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({
  label = "Select Date",
  value,
  onChange,
}) => {
  // Use controlled value if provided, otherwise use local state
  const [localDate, setLocalDate] = useState<string>(() => {
    return value || LocalStorage.getSelectedDate() || "";
  });

  // Update local state when value prop changes
  useEffect(() => {
    if (value !== undefined) {
      setLocalDate(value);
    }
  }, [value]);

  // Save to localStorage when local date changes (only for uncontrolled usage)
  useEffect(() => {
    if (value === undefined) {
      LocalStorage.setSelectedDate(localDate);
    }
  }, [localDate, value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setLocalDate(newDate);
    if (onChange) {
      onChange(newDate);
    }
  };

  return (
    <div className="date-picker">
      {label && <label>{label}</label>}
      <input
        type="date"
        value={localDate}
        onChange={handleChange}
        style={{ marginLeft: "8px" }}
      />
    </div>
  );
};

export default DatePicker;
