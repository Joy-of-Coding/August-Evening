// src/components/LocalStorage.ts
// Centralized local storage utility for Budget Buddy

export interface IncomeSource {
  name: string;
  amount: number;
  date: string;
}


const INCOME_KEY = "budgetBuddyIncome";
const DATE_KEY = "budgetBuddySelectedDate";

export const LocalStorage = {
  getIncome(): IncomeSource[] {
    const stored = localStorage.getItem(INCOME_KEY);
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  },

  setIncome(incomes: IncomeSource[]): void {
    localStorage.setItem(INCOME_KEY, JSON.stringify(incomes));
  },

  clearIncome(): void {
    localStorage.removeItem(INCOME_KEY);
  },
  // DatePicker support
  setSelectedDate(date: string): void {
    localStorage.setItem(DATE_KEY, date);
  },

  getSelectedDate(): string | null {
    return localStorage.getItem(DATE_KEY);
  },

  clearSelectedDate(): void {
    localStorage.removeItem(DATE_KEY);
  },
}; 
