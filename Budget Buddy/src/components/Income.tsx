

import React, { useState, useEffect } from "react";
import { LocalStorage } from "./LocalStorage";
import type { IncomeSource } from "./LocalStorage";

const Income: React.FC = () => {
  const [incomes, setIncomes] = useState<IncomeSource[]>([
    { name: "", amount: 0, date: "" },
  ]);


  // Load from LocalStorage on mount
  useEffect(() => {
    setIncomes(LocalStorage.getIncome());
  }, []);

  // Save to LocalStorage on change
  useEffect(() => {
    LocalStorage.setIncome(incomes);
  }, [incomes]);

  const handleChange = (index: number, field: keyof IncomeSource, value: string) => {
    const updated = incomes.map((income, i) =>
      i === index ? { ...income, [field]: field === "amount" ? Number(value) : value } : income
    );
    setIncomes(updated);
  };

  const addIncome = (index: number) => {
    const updated = [
      ...incomes.slice(0, index + 1),
      { name: "", amount: 0, date: "" },
      ...incomes.slice(index + 1),
    ];
    setIncomes(updated);
  };

  const removeIncome = (index: number) => {
    if (incomes.length === 1) return;
    setIncomes(incomes.filter((_, i) => i !== index));
  };

  const totalIncome = incomes.reduce((sum, inc) => sum + (isNaN(inc.amount) ? 0 : inc.amount), 0);

  return (
    <div style={{ maxWidth: 500, margin: "0 auto" }}>
      <h2>Monthly Income</h2>
      {/* Labels Row */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
        <label style={{ flex: 2, marginRight: 8, textAlign: "left" }}>Account</label>
        <label style={{ flex: 1, marginRight: 8, textAlign: "left" }}>Amount</label>
        <label style={{ flex: 1, marginRight: 8, textAlign: "left" }}>Date</label>
        <span style={{ width: 48 }}></span> {/* Space for buttons */}
      </div>
      {incomes.map((income, idx) => (
        <div key={idx} style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
          <input
            type="text"
            placeholder="Name"
            value={income.name}
            onChange={e => handleChange(idx, "name", e.target.value)}
            style={{ marginRight: 8, flex: 2 }}
          />
          <input
            type="number"
            placeholder="Amount"
            value={income.amount}
            onChange={e => handleChange(idx, "amount", e.target.value)}
            style={{ marginRight: 8, flex: 1 }}
          />
          <input
            type="date"
            value={income.date}
            onChange={e => handleChange(idx, "date", e.target.value)}
            style={{ marginRight: 8, flex: 1 }}
          />
          <button onClick={() => addIncome(idx)} title="Add income" style={{ marginRight: 4 }}>+</button>
          <button onClick={() => removeIncome(idx)} title="Remove income" disabled={incomes.length === 1}>-</button>
        </div>
      ))}
      <div style={{ marginTop: 16, fontWeight: "bold" }}>
        Total Income: {totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </div>
    </div>
  );
};

export default Income;
