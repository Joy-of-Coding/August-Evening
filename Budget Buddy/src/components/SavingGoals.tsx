

import React, { useState, useEffect } from "react";
import DatePicker from "./DatePicker";

interface Goal {
  name: string;
  target: number;
  current: number;
  date: string;
  pointsCalculation?: string;
}

const SavingGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([
    { name: "", target: 0, current: 0, date: "" },
  ]);

  // Handlers for inline editing
  const handleChange = (index: number, field: keyof Goal, value: string) => {
    setGoals(goals => goals.map((goal, i) =>
      i === index ? { ...goal, [field]: field === "target" || field === "current" ? Number(value) : value } : goal
    ));
  };

  // Points calculation handler
  const handlePointsCalculation = (index: number, p4: string, p5: string, p6: string) => {
    const n4 = Number(p4), n5 = Number(p5), n6 = Number(p6);
    if (!isNaN(n4) && !isNaN(n5) && !isNaN(n6)) {
      setGoals(goals => goals.map((goal, i) =>
        i === index ? {
          ...goal,
          current: n4 - (n5 + n6),
          pointsCalculation: `${n4} - (${n5} + ${n6})`
        } : goal
      ));
    }
  };

  const addGoal = (index: number) => {
    setGoals(goals => [
      ...goals.slice(0, index + 1),
      { name: "", target: 0, current: 0, date: "" },
      ...goals.slice(index + 1),
    ]);
  };

  const removeGoal = (index: number) => {
    if (goals.length === 1) return;
    setGoals(goals => goals.filter((_, i) => i !== index));
  };

  const [showSavingGoals, setShowSavingGoals] = useState(true);

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
        <h2 style={{ margin: 0, marginRight: 12, color: '#fff' }}>Saving Goals</h2>
        <button
          onClick={() => setShowSavingGoals(v => !v)}
          style={{ fontSize: '12px', padding: '1px 6px', fontWeight: 700, backgroundColor: '#334155', color: '#fff', border: '1px solid #fff', borderRadius: 6, cursor: 'pointer' }}
        >
          {showSavingGoals ? "Hide" : "Show"}
        </button>
      </div>
      {showSavingGoals && (
        <div className="saving-goals-container">
          {/* Labels Row */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
            <label style={{ flex: 2, marginRight: 8, textAlign: "left" }}>Name</label>
            <label style={{ flex: 1, marginRight: 8, textAlign: "left" }}>Target</label>
            <label style={{ flex: 1, marginRight: 8, textAlign: "left" }}>Current</label>
            {/* <label style={{ flex: 2, marginRight: 8, textAlign: "left" }}>Points Calc (4-(5+6))</label> */}
            <label style={{ flex: 2, marginRight: 8, textAlign: "left" }}>Goal Date</label>
            <label style={{ flex: 2, marginRight: 8, textAlign: "left" }}>Progress</label>
            <span style={{ width: 48 }}></span>
          </div>
          {goals.map((goal, idx) => {
            const progress = goal.target > 0 ? Math.min((goal.current / goal.target) * 100, 100) : 0;
            return (
              <div key={idx} style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                <input
                  type="text"
                  placeholder="Name"
                  value={goal.name}
                  onChange={e => handleChange(idx, "name", e.target.value)}
                  style={{ marginRight: 8, flex: 2 }}
                />
                <input
                  type="number"
                  placeholder="Target"
                  value={goal.target}
                  onChange={e => handleChange(idx, "target", e.target.value)}
                  style={{ marginRight: 8, flex: 1, width: '90px' }}
                />
                <input
                  type="number"
                  placeholder="Current"
                  value={goal.current}
                  onChange={e => handleChange(idx, "current", e.target.value)}
                  style={{ marginRight: 8, flex: 1, width: '90px' }}
                />
                <span style={{ flex: 2, marginRight: 8 }}>
                  <DatePicker
                    label=""
                    value={goal.date}
                    onChange={date => handleChange(idx, "date", date)}
                  />
                </span>
                <span style={{ flex: 2, marginRight: 8, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                  <div style={{ background: '#eee', borderRadius: 8, height: 18, width: '200px', overflow: 'hidden', marginRight: 8, display: 'inline-block' }}>
                    <div
                      style={{
                        width: `${progress}%`,
                        height: '100%',
                        background: 'green',
                        transition: 'width 0.5s',
                      }}
                    />
                  </div>
                  <span>{progress.toFixed(1)}%</span>
                </span>
              {idx === 0 ? (
                <>
                <button
                  onClick={() => addGoal(idx)}
                  title="Add goal"
                  style={{ fontSize: '0.75em', padding: '2px 8px', width: 24, height: 24, marginRight: 4 }}
                >
                  +
                </button>
                <span style={{ width: 24, height: 24 }}></span>
                </>
              ) : (
                <>
                  <button
                    onClick={() => addGoal(idx)}
                    title="Add goal"
                    style={{ fontSize: '0.75em', padding: '2px 8px', width: 24, height: 24, marginRight: 4 }}
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeGoal(idx)}
                    title="Remove goal"
                    disabled={goals.length === 1}
                    style={{ fontSize: '0.75em', padding: '2px 8px', width: 24, height: 24, marginRight: 4 }}
                  >
                    -
                  </button>
                </>
              )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SavingGoals;
