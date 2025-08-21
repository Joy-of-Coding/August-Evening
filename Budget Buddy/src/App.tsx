import "./App.css";
import Header from "./components/Header";
import MonthlyOverviewBar from "./components/MonthlyOverviewBar";
import SpendingByCategoryPie from "./components/SpendingByCategoryPie";
import SavingGoals from "./components/SavingGoals";
import DiscretionaryExpense from "./components/DiscretionaryExpense";
import FixedExpenses from "./components/FixedExpenses";
import Income from "./components/Income";
import type { Expense, ExpenseCategory, Income as IncomeType, CategoryTotal } from "./types";
import UserProfile from "./components/UserProfile";
// import userSilhouette from "./assets/user-silhouette.svg";
import React from "react";

function App() {
  // Example data — replace with real state or API data later
  const [route, setRoute] = React.useState<'main' | 'profile'>('main');
  const [userName, setUserName] = React.useState<string>(() => localStorage.getItem('budgetBuddyUserName') || "");

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
    <div className="main-container" style={{ position: 'relative' }}>
      {/* Upper right: user profile link */}
      {route === 'main' && (
        <div style={{ position: 'absolute', top: 24, right: 32 }}>
          <img
            src={localStorage.getItem('budgetBuddyProfileImage') || "https://thumb.ac-illust.com/8a/8abc6308b0fdc74c612b769383d2ad7e_t.jpeg"}
            alt="User Profile"
            style={{ width: 102, height: 102, cursor: 'pointer', borderRadius: '50%', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', objectFit: 'cover' }}
            onClick={() => setRoute('profile')}
          />
        </div>
      )}
      {/* Upper left: welcome message */}
      {route === 'main' && userName && (
        <div style={{ position: 'absolute', top: 24, left: 32, color: '#fff', fontWeight: 600, fontSize: '1.2em' }}>
          Welcome {userName}
        </div>
      )}
      {route === 'profile' ? (
        <UserProfile
          initialName={userName}
          onSave={name => {
            setUserName(name);
            localStorage.setItem('budgetBuddyUserName', name);
            setRoute('main');
          }}
        />
      ) : (
        <>
          <Header />
          <MonthlyOverviewBar
            monthlyExpenseTotal={expenses.reduce((sum, exp) => sum + exp.amount, 0)}
            monthlyIncomeTotal={incomes.reduce((sum, inc) => sum + inc.amount, 0)}
          />
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
          <SavingGoals />
        </>
      )}
    </div>
  );
}

export default App;