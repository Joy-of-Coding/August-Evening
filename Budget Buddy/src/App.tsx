import "./App.css";
import { useEffect, useMemo, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Header from "./components/Header";
import MonthlyOverviewBar from "./components/MonthlyOverviewBar";
import SpendingByCategoryPie from "./components/SpendingByCategoryPie";
import SavingGoals from "./components/SavingGoals";
import DiscretionaryExpense from "./components/DiscretionaryExpense";
import FixedExpenses from "./components/FixedExpenses";
import Income from "./components/Income";
import type { ExpenseCategory, CategoryTotal } from "./types";

import type { Transaction } from "./components/transactions/TransactionRow";
import CreditsPage from "./components/CreditsPage";

// Dashboard component with all the budget functionality
function Dashboard() {
  const [txVersion, setTxVersion] = useState(0);

  useEffect(() => {
    const onUpdated = () => setTxVersion(v => v + 1);
    window.addEventListener('bb:transactions-updated', onUpdated);
    return () => window.removeEventListener('bb:transactions-updated', onUpdated);
  }, []);

  function loadTransactions(): Transaction[] {
    try {
      const fx = JSON.parse(localStorage.getItem("bb_tx_fixed") || "[]");
      const dx = JSON.parse(localStorage.getItem("bb_tx_discretionary") || "[]");
      const rows = ([] as Transaction[]).concat(
        Array.isArray(fx) ? fx : [],
        Array.isArray(dx) ? dx : []
      );
      return rows;
    } catch {
      return [];
    }
  }

  function aggregateByCategory(items: Transaction[]): CategoryTotal[] {
    const categoryToTotal = new Map<ExpenseCategory, number>();
    for (const item of items) {
      const raw = (item.category ?? "") as string;
      const category = (raw && raw.trim() ? raw.trim() : "Other") as ExpenseCategory;
      const amount = Number(item.amount) || 0;
      const existing = categoryToTotal.get(category) ?? 0;
      categoryToTotal.set(category, existing + Math.max(amount, 0));
    }
    return Array.from(categoryToTotal.entries()).map(([category, amount]) => ({
      category,
      amount,
    }));
  }

  const transactions = useMemo(() => loadTransactions(), [txVersion]);
  const totalsByCategory = useMemo(() => aggregateByCategory(transactions), [txVersion]);
  const totalIncome = useMemo(() => {
    try {
      const incomeTransactions = JSON.parse(localStorage.getItem('bb_tx_income') || '[]');
      return incomeTransactions.reduce((sum: number, inc: any) => sum + (Number(inc.amount) || 0), 0);
    } catch {
      return 0;
    }
  }, [txVersion]);

  return (
    <div className="main-container">
      <Header />
      <div
        style={{ padding: "20px", textAlign: "center", marginBottom: "20px" }}
      >
        <Link
          to="/credits"
          style={{ color: "#00bcd4", textDecoration: "underline" }}
        >
          View Credits Page
        </Link>
      </div>
      <MonthlyOverviewBar
        monthlyExpenseTotal={totalsByCategory.reduce((sum, c) => sum + c.amount, 0)}
        monthlyIncomeTotal={totalIncome}
      />
      <div style={{ padding: 16 }}>
        <SpendingByCategoryPie
          data={totalsByCategory}
          title="Spending by Category"
          denominatorTotal={totalIncome}
          centerValue={totalIncome - totalsByCategory.reduce((s, c) => s + c.amount, 0)}
        />
      </div>
      <Income />
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr', 
        gap: '20px', 
        padding: '16px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <FixedExpenses />
        <DiscretionaryExpense />
      </div>
      <SavingGoals />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/credits" element={<CreditsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
