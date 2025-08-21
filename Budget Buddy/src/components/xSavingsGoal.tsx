import React, { useState } from 'react';
import DatePicker from './DatePicker';

interface SavingsGoalProps {
    name: string;
    target: number;
    current: number;
    pointsCalculation?: string;
    onDateChange?: (date: string) => void;
}

const SavingsGoal: React.FC<SavingsGoalProps> = ({ name, target, current, pointsCalculation, onDateChange }) => {
    const [goalDate, setGoalDate] = useState<string>('');

  // Calculate progress percentage
  const progress = Math.min((current / target) * 100, 100);
    const isOnTarget = current >= target;

    const handleDateChange = (date: string) => {
    setGoalDate(date);
    if (onDateChange) onDateChange(date);
    };

    return (
        <div className="savings-goal" style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, maxWidth: 400 }}>
            <h2>Saving Goals</h2>
            <h3>{name}</h3>
            {pointsCalculation && (
                <div style={{ marginBottom: 8, fontStyle: 'italic', color: '#555' }}>
                    Points calculation: {pointsCalculation}
                </div>
            )}
            <div style={{ marginBottom: 8 }}>
                Target: ${typeof target === 'number' ? target.toLocaleString() : '0'}<br />
                Current: ${typeof current === 'number' ? current.toLocaleString() : '0'}
            </div>
            <div style={{ marginBottom: 8 }}>
                <div style={{ background: '#eee', borderRadius: 8, height: 24, width: '100%', overflow: 'hidden' }}>
                    <div
                        style={{
                            width: `${progress}%`,
                            height: '100%',
                            background: isOnTarget ? 'green' : 'red',
                            transition: 'width 0.5s',
                        }}
                    />
                </div>
                <div style={{ textAlign: 'right', fontSize: 12 }}>{progress.toFixed(1)}%</div>
            </div>
            <DatePicker label="Goal Date" value={goalDate} onChange={handleDateChange} />
        </div>
    );
};

export default SavingsGoal;
