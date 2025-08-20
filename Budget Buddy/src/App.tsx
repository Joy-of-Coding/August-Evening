import "./App.css";
import Header from "./components/Header";
import MonthlyOverviewBar from "./components/MonthlyOverviewBar";
import SpendingByCategoryPie from "./components/SpendingByCategoryPie";
import SavingGoal from "./components/SavingsGoal";
import DiscretionaryExpense from "./components/DiscretionaryExpense";
import FixedExpenses from "./components/FixedExpenses";
import Income from "./components/Income";
import type { Expense, ExpenseCategory, Income as IncomeType, CategoryTotal } from "./types";

function App() {
  // Example data — replace with real state or API data later
  const incomes: IncomeType[] = [
    { id: "inc-1", source: "Salary", amount: 4200, date: "2025-08-01" },
    { id: "inc-2", source: "Freelance", amount: 600, date: "2025-08-15" },
  ];

  const expenses: Expense[] = [
    { id: "exp-1", category: "Housing", amount: 1500, date: "2025-08-03" },
    { id: "exp-2", category: "Food", amount: 420, date: "2025-08-10" },
    { id: "exp-3", category: "Transportation", amount: 160, date: "2025-08-08" },
    { id: "exp-4", category: "Utilities", amount: 220, date: "2025-08-05" },
    { id: "exp-5", category: "Entertainment", amount: 140, date: "2025-08-12" },
    { id: "exp-6", category: "Healthcare", amount: 75, date: "2025-08-18" },
    { id: "exp-7", category: "Other", amount: 60, date: "2025-08-20" },
  ];

  function aggregateByCategory(items: Expense[]): CategoryTotal[] {
    const categoryToTotal = new Map<ExpenseCategory, number>();
    for (const item of items) {
      const existing = categoryToTotal.get(item.category) ?? 0;
      categoryToTotal.set(item.category as ExpenseCategory, existing + item.amount);
    }
    return Array.from(categoryToTotal.entries()).map(([category, amount]) => ({ category, amount }));
  }

  const totalsByCategory = aggregateByCategory(expenses);
  const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);

  return (
    <div className="main-container">
      <Header />
      <MonthlyOverviewBar />
      <div style={{ padding: 16 }}>
        <SpendingByCategoryPie
          data={totalsByCategory}
          title="Spending by Category"
          denominatorTotal={totalIncome}
        />
      </div>
      <Income />
      <FixedExpenses />
      <DiscretionaryExpense />
      <SavingGoal />
    </div>
  );
}

export default App;
