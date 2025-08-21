

import React, { useEffect, useState } from "react";
import "./MonthlyOverviewBar.css";

interface MonthlyOverviewBarProps {
  monthlyExpenseTotal: number;
  monthlyIncomeTotal: number;
}



const MonthlyOverviewBar: React.FC<MonthlyOverviewBarProps> = ({ monthlyExpenseTotal }) => {
  const [maxBudget, setMaxBudget] = useState<number>(0);

  useEffect(() => {
    const stored = localStorage.getItem("budgetBuddyTotalIncome");
    setMaxBudget(stored ? Number(stored) : 0);
  }, []);

  const percent = maxBudget > 0 ? Math.min((monthlyExpenseTotal / maxBudget) * 100, 100) : 0;

  return (
    <div className="monthly-overview-bar-container">
      <div className="monthly-overview-bar-labels">
        <span>Start</span>
        <span>Max Budget: {maxBudget.toLocaleString()}</span>
      </div>
      <div className="monthly-overview-bar">
        <div
          className="monthly-overview-bar-slider"
          style={{ left: `calc(${percent}% - 12px)` }}
        >
          <div className="monthly-overview-bar-knob" />
        </div>
        <div
          className="monthly-overview-bar-fill"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="monthly-overview-bar-info">
        <span>Expense: {monthlyExpenseTotal.toLocaleString()}</span>
        <span>{percent === 100 ? "Maxed Out" : `${percent.toFixed(1)}% of Max Budget`}</span>
      </div>
    </div>
  );
};

export default MonthlyOverviewBar;

