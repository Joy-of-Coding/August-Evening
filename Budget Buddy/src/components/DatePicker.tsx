import React, { useState, useEffect } from 'react';
import { LocalStorage } from './LocalStorage';

export interface DatePickerProps {
	label?: string;
	value?: string;
	onChange?: (date: string) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ label = 'Select Date', value, onChange }) => {
	// Try to get initial value from LocalStorage if not provided
	const initialDate = value || LocalStorage.getSelectedDate() || '';
	const [selectedDate, setSelectedDate] = useState<string>(initialDate);

	useEffect(() => {
		LocalStorage.setSelectedDate(selectedDate);
		if (onChange) {
			onChange(selectedDate);
		}
	}, [selectedDate, onChange]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedDate(e.target.value);
	};
 
	return (
		<div className="date-picker">
			{label && <label>{label}</label>}
			<input
				type="date"
				value={selectedDate}
				onChange={handleChange}
				style={{ marginLeft: '8px' }}
			/>
		</div>
	);
};

export default DatePicker;
