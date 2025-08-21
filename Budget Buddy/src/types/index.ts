export type ExpenseCategory =
  | "Housing"
  | "Food"
  | "Transportation"
  | "Utilities"
  | "Entertainment"
  | "Healthcare"
  | "Education"
  | "Savings"
  | "Debt"
  | "Other";

export interface Expense {
  id: string;
  category: ExpenseCategory;
  amount: number;
  description?: string;
  date: string; // ISO date string
}

export interface Income {
  id: string;
  source: string;
  amount: number;
  date: string; // ISO date string
}

export interface CategoryTotal {
  category: ExpenseCategory | string;
  amount: number;
}

