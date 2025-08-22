import React, { useState } from 'react';
import DatePicker from './DatePicker';

interface SavingsGoalProps {
    name: string;
    target: number;
    current: number;
    onDateChange?: (date: string) => void;
}

const SavingsGoal: React.FC<SavingsGoalProps> = ({ name, target, current, onDateChange }) => {
    const [goalDate, setGoalDate] = useState<string>('');

  // Calculate progress percentage
  const progress = Math.min((current / target) * 100, 100);
    const isOnTarget = current >= target;

    const handleDateChange = (date: string) => {
    setGoalDate(date);
    if (onDateChange) onDateChange(date);
    };

    return (
        <div className="savings-goal" style={{ 
            border: '2px solid #8B5CF6', 
            borderRadius: 16, 
            padding: 24, 
            maxWidth: 400,
            backgroundColor: '#F9FAFB',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
            <h2 style={{
                textAlign: 'center',
                marginBottom: '16px',
                padding: '12px 16px',
                backgroundColor: '#F3F4F6',
                borderRadius: '8px',
                fontSize: '20px',
                fontWeight: 700,
                color: '#1F2937',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                border: '2px solid #8B5CF6',
                margin: '0 0 16px 0'
            }}>
                Saving Goals
            </h2>
            <h3 style={{
                textAlign: 'center',
                marginBottom: '16px',
                padding: '8px 12px',
                backgroundColor: '#8B5CF6',
                borderRadius: '6px',
                fontSize: '18px',
                fontWeight: 600,
                color: '#FFFFFF',
                textTransform: 'capitalize',
                letterSpacing: '0.02em'
            }}>
                {name}
            </h3>
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
