import React, { useState, useEffect, useMemo } from "react";
import { LocalStorage } from "./LocalStorage";
import type { IncomeSource } from "./LocalStorage";

const Income: React.FC = () => {
  const [incomes, setIncomes] = useState<IncomeSource[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    const storedIncomes = LocalStorage.getIncome();
    if (storedIncomes.length > 0) {
      setIncomes(storedIncomes);
    } else {
      // Set default income if no stored data
      setIncomes([{ name: "", amount: 0, date: "" }]);
    }
    setIsLoaded(true);
  }, []);

  // Save to LocalStorage on change, but only after initial load
  useEffect(() => {
    if (isLoaded) {
      LocalStorage.setIncome(incomes);
    }
  }, [incomes, isLoaded]);

  const handleChange = (
    index: number,
    field: keyof IncomeSource,
    value: string
  ) => {
    const updated = incomes.map((income, i) =>
      i === index
        ? { ...income, [field]: field === "amount" ? Number(value) : value }
        : income
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

  const totalIncome = useMemo(() => {
    return incomes.reduce(
      (sum, inc) => sum + (isNaN(inc.amount) ? 0 : inc.amount),
      0
    );
  }, [incomes]);

  // Store totalIncome in LocalStorage for use in MonthlyOverviewBar
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("budgetBuddyTotalIncome", totalIncome.toString());
    }
  }, [totalIncome, isLoaded]);

  return (
    <div style={{ maxWidth: 500, margin: "0 auto" }}>
      <h2>Source Income</h2>
      {/* Labels Row */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
        <label style={{ flex: 2, marginRight: 8, textAlign: "left" }}>
          Account
        </label>
        <label style={{ flex: 1, marginRight: 8, textAlign: "left" }}>
          Amount
        </label>
        <label style={{ flex: 1, marginRight: 8, textAlign: "left" }}>
          Date
        </label>
        <span style={{ width: 48 }}></span> {/* Space for buttons */}
      </div>
      {incomes.map((income, idx) => (
        <div
          key={idx}
          style={{ display: "flex", alignItems: "center", marginBottom: 8 }}
        >
          <input
            type="text"
            placeholder="Name"
            value={income.name}
            onChange={(e) => handleChange(idx, "name", e.target.value)}
            style={{ marginRight: 8, flex: 2 }}
          />
          <input
            type="number"
            placeholder="Amount"
            value={income.amount}
            onChange={(e) => handleChange(idx, "amount", e.target.value)}
            style={{ marginRight: 8, flex: 1 }}
          />
          <input
            type="date"
            value={income.date}
            onChange={(e) => handleChange(idx, "date", e.target.value)}
            style={{ marginRight: 8, flex: 1 }}
          />
          {/* <button
            onClick={() => addIncome(idx)}
            title="Add income"
            style={{ marginRight: 4, fontSize: '10px', padding: '0.34em 0.80em', fontWeight: 900 }}
          >
            +
          </button>
          <button
            onClick={() => removeIncome(idx)}
            title="Remove income"
            disabled={incomes.length === 1}
            style={{ fontSize: '10px',  padding: '0.34em 0.80em', fontWeight: 900 }}
          >
            -
          </button> */}

          {idx === 0 ? (
            <>
              <button
                onClick={() => addIncome(idx)}
                title="Add Income"
                style={{
                  fontSize: "0.75em",
                  padding: "2px 8px",
                  width: 24,
                  height: 24,
                  marginRight: 4,
                }}
              >
                +
              </button>
              <span style={{ width: 24, height: 24 }}></span>
            </>
          ) : (
            <>
              <button
                onClick={() => addIncome(idx)}
                title="Add Income"
                style={{
                  fontSize: "0.75em",
                  padding: "2px 8px",
                  width: 24,
                  height: 24,
                  marginRight: 4,
                }}
              >
                +
              </button>
              <button
                onClick={() => removeIncome(idx)}
                title="Remove Income"
                disabled={incomes.length === 1}
                style={{
                  fontSize: "0.75em",
                  padding: "2px 8px",
                  width: 24,
                  height: 24,
                  marginRight: 4,
                }}
              >
                -
              </button>
            </>
          )}
        </div>
      ))}
      <div style={{ marginTop: 16, fontWeight: "bold" }}>
        Total Income:{" "}
        {totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </div>
    </div>
  );
};

export default Income;
