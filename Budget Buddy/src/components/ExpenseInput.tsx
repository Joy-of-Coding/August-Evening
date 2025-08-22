import React, { useState, useEffect } from 'react';
import { monthlyExpenses } from '../data/monthlyExpenses';
import CategoryManager from './expenses/CategoryManager';
import AccountManager from './expenses/AccountManager';
import ExpenseRow from './expenses/ExpenseRow';
import { useLocalStorageList } from './expenses/useLocalStorageList';

export interface ExpenseInputField {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  account?: string;
}

export interface ExpenseInputProps {
  title: string;
  expenseType: 'fixed' | 'discretionary';
  initialExpenses?: ExpenseInputField[];
  onExpensesChange?: (expenses: ExpenseInputField[]) => void;
  maxWidth?: string;
  showCategoryManagement?: boolean;
}

const ExpenseInput: React.FC<ExpenseInputProps> = ({ 
  title,
  expenseType,
  initialExpenses = [],
  onExpensesChange,
  maxWidth = '800px',
  showCategoryManagement = true
}) => {
  const storageKey = `bb_expense_rows_${expenseType}`;
  const [expenseFields, setExpenseFields] = useState<ExpenseInputField[]>(
    initialExpenses.length > 0 ? initialExpenses : [{
      id: '1',
      amount: 0,
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      account: 'Checking'
    }]
  );

  const [categories, setCategories] = useLocalStorageList('bb_categories', []);
  const [accounts, setAccounts] = useLocalStorageList('bb_accounts', ["Checking", "Savings", "Credit Card"]);
  const [newCategory, setNewCategory] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<string>('Checking');
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [newAccount, setNewAccount] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [pendingFieldIdForNewCategory, setPendingFieldIdForNewCategory] = useState<string | null>(null);
  const [pendingFieldIdForNewAccount, setPendingFieldIdForNewAccount] = useState<string | null>(null);

  // constants imported

  // Initialize categories from monthlyExpenses when empty
  useEffect(() => {
    if (categories.length === 0) {
      const uniqueCategories = [...new Set(monthlyExpenses.map(expense => expense.category))];
      setCategories(uniqueCategories);
      setSelectedCategory(uniqueCategories[0] ?? '');
    } else if (!selectedCategory) {
      setSelectedCategory(categories[0] ?? '');
    }
  }, [categories, selectedCategory, setCategories]);

  // Ensure accounts have a selection
  useEffect(() => {
    if (accounts.length > 0 && (!selectedAccount || !accounts.includes(selectedAccount))) {
      setSelectedAccount(accounts[0]);
    }
  }, [accounts, selectedAccount]);
  

  // Calculate total expenses
  const totalExpenses = expenseFields.reduce((sum, field) => sum + field.amount, 0);

  // Notify parent component of changes
  useEffect(() => {
    onExpensesChange?.(expenseFields);
  }, [expenseFields, onExpensesChange]);

  // Load expense rows from localStorage (per section)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const normalized = parsed.map((row: any, index: number) => ({
            id: String(row?.id ?? `${Date.now()}-${index}`),
            amount: Number(row?.amount ?? 0),
            category: String(row?.category ?? ''),
            description: String(row?.description ?? ''),
            date: String(row?.date ?? new Date().toISOString().split('T')[0]),
            account: row?.account ? String(row.account) : 'Checking',
          }));
          setExpenseFields(normalized.length > 0 ? normalized : expenseFields);
        }
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  // Persist expense rows to localStorage (per section)
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(expenseFields));
    } catch {}
  }, [storageKey, expenseFields]);

  const addExpenseField = () => {
    const newField: ExpenseInputField = {
      id: Date.now().toString(),
      amount: 0,
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    };
    setExpenseFields([...expenseFields, newField]);
  };

  const removeExpenseField = (id: string) => {
    if (expenseFields.length > 1) {
      setExpenseFields(expenseFields.filter(field => field.id !== id));
    }
  };

  const updateExpenseField = (id: string, field: Partial<ExpenseInputField>) => {
    setExpenseFields(expenseFields.map(expenseField => 
      expenseField.id === id ? { ...expenseField, ...field } : expenseField
    ));
  };

  const addNewCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      const created = newCategory.trim();
      const updated = [...categories, created];
      setCategories(updated);
      setSelectedCategory(created);
      setNewCategory('');
      setShowAddCategory(false);
      if (pendingFieldIdForNewCategory) {
        setExpenseFields(prev => prev.map(f => (
          f.id === pendingFieldIdForNewCategory ? { ...f, category: created } : f
        )));
        setPendingFieldIdForNewCategory(null);
      }
    }
  };

  const removeCategory = (categoryToRemove: string) => {
    // Don't remove if it's the only category or if it's being used
    if (categories.length > 1 && !expenseFields.some(field => field.category === categoryToRemove)) {
      const updated = categories.filter(cat => cat !== categoryToRemove);
      setCategories(updated);
      if (selectedCategory === categoryToRemove) {
        setSelectedCategory(updated[0] ?? '');
      }
    }
  };

  const addNewAccount = () => {
    if (newAccount.trim() && !accounts.includes(newAccount.trim())) {
      const created = newAccount.trim();
      const updated = [...accounts, created];
      setAccounts(updated);
      setSelectedAccount(created);
      setNewAccount('');
      setShowAddAccount(false);
      if (pendingFieldIdForNewAccount) {
        setExpenseFields(prev => prev.map(f => (
          f.id === pendingFieldIdForNewAccount ? { ...f, account: created } : f
        )));
        setPendingFieldIdForNewAccount(null);
      }
    }
  };

  const removeAccount = (accountToRemove: string) => {
    if (accounts.length > 1 && !expenseFields.some(field => field.account === accountToRemove)) {
      const updated = accounts.filter(a => a !== accountToRemove);
      setAccounts(updated);
      if (selectedAccount === accountToRemove) {
        setSelectedAccount(updated[0] ?? '');
      }
    }
  };

  const getExpenseTypeColor = () => {
    return expenseType === 'fixed' ? '#dc3545' : '#fd7e14';
  };

  const getExpenseTypeBackground = () => {
    return expenseType === 'fixed' ? '#f8d7da' : '#fff3cd';
  };

  return (
    <div className="expense-input-container" style={{ padding: '20px', maxWidth }}>
      <h2 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ 
          marginBottom: '20px', 
          color: '#1F2937',
          borderBottom: `3px solid ${getExpenseTypeColor()}`,
          padding: '15px 20px',
          cursor: 'pointer',
          userSelect: 'none',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#F9FAFB',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          fontSize: '24px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          border: `2px solid ${getExpenseTypeColor()}`,
          transition: 'all 0.2s ease-in-out'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        }}
      >
        <span>{title}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ 
            fontSize: '16px', 
            color: getExpenseTypeColor(),
            fontWeight: '600'
          }}>
            ${totalExpenses.toFixed(2)}
          </span>
          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
            {isExpanded ? '−' : '+'}
          </span>
        </div>
      </h2>
      
      {isExpanded && showCategoryManagement && (
        <CategoryManager
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          showAddCategory={showAddCategory}
          setShowAddCategory={setShowAddCategory}
          newCategory={newCategory}
          setNewCategory={setNewCategory}
          addNewCategory={addNewCategory}
          removeCategory={removeCategory}
          canRemove={(name) => !expenseFields.some(f => f.category === name) && categories.length > 1}
          getAccentColor={getExpenseTypeColor}
        />
      )}

      {isExpanded && showCategoryManagement && (
        <AccountManager
          accounts={accounts}
          selectedAccount={selectedAccount}
          setSelectedAccount={setSelectedAccount}
          showAddAccount={showAddAccount}
          setShowAddAccount={setShowAddAccount}
          newAccount={newAccount}
          setNewAccount={setNewAccount}
          addNewAccount={addNewAccount}
          removeAccount={removeAccount}
          canRemove={(name) => !expenseFields.some(f => f.account === name) && accounts.length > 1}
          getAccentColor={getExpenseTypeColor}
        />
      )}

      {/* Expense Input Fields - Only show if expanded */}
      {isExpanded && expenseFields.map((field) => (
        <ExpenseRow
          key={field.id}
          value={field}
          categories={categories}
          accounts={accounts}
          onChange={updateExpenseField}
          onAdd={addExpenseField}
          onRemove={removeExpenseField}
          setShowAddCategory={setShowAddCategory}
          setPendingFieldIdForNewCategory={setPendingFieldIdForNewCategory}
          setShowAddAccount={setShowAddAccount}
          setPendingFieldIdForNewAccount={setPendingFieldIdForNewAccount}
          getAccentColor={getExpenseTypeColor}
        />
      ))}

      {/* Total Expenses Display - Only show if expanded */}
      {isExpanded && (
        <div style={{ 
          marginTop: '20px',
          padding: '20px',
          backgroundColor: getExpenseTypeBackground(),
          borderRadius: '8px',
          border: `2px solid ${getExpenseTypeColor()}`
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            fontSize: '18px',
            fontWeight: '600'
          }}>
            <span>Total {expenseType === 'fixed' ? 'Fixed' : 'Discretionary'} Expenses:</span>
            <span style={{ 
              color: getExpenseTypeColor(),
              fontSize: '24px',
              fontWeight: '700'
            }}>
              ${totalExpenses.toFixed(2)}
          </span>
        </div>
      </div>
      )}

      {/* Summary - Only show if expanded */}
      {isExpanded && (
        <div style={{ marginTop: '20px', fontSize: '14px', color: '#6c757d' }}>
          <p>• Use the + button to add new expense fields</p>
          <p>• Use the - button to remove expense fields (minimum 1 field)</p>
          {showCategoryManagement && (
            <>
              <p>• Add new categories using the "Add Category" button</p>
              <p>• Remove categories using the × button (if not in use)</p>
            </>
          )}
          <p>• Total expenses are automatically calculated</p>
          <p>• {expenseType === 'fixed' ? 'Fixed expenses are regular, recurring costs' : 'Discretionary expenses are optional, variable costs'}</p>
        </div>
      )}
    </div>
  );
};

export default ExpenseInput;
