// authors - Jasmina and John and Mindi

import React from "react";
import type { Expense, Income as IncomeType } from "../types";

type Props = {
  incomes: IncomeType[];
  expenses: Expense[];
};

function getCurrentMonthItems<T extends { date: string }>(items: T[]) {
  const now = new Date();
  return items.filter(item => {
    const itemDate = new Date(item.date);
    return (
      itemDate.getFullYear() === now.getFullYear() &&
      itemDate.getMonth() === now.getMonth()
    );
  });
}

export const MonthlySummary: React.FC<Props> = ({ incomes, expenses }) => {
  const monthlyIncomes = getCurrentMonthItems(incomes);
  const monthlyExpenses = getCurrentMonthItems(expenses);

  const totalIncome = monthlyIncomes.reduce((sum, inc) => sum + inc.amount, 0);
  const totalExpenses = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);


  return (
    <div style={{ padding: "1rem", background: "green", color: "white", marginBottom: "1rem" }}>
      <h2>Monthly Summary</h2>
      <p>Total Income: ${totalIncome.toFixed(2)}</p>
      <p>Total Expenses: ${totalExpenses.toFixed(2)}</p>
      <p>Net: ${(totalIncome - totalExpenses).toFixed(2)}</p>
    </div>
  );
};