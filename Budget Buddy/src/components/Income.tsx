import React, { useEffect, useMemo, useState } from 'react';
import TransactionRow, { type Transaction } from './transactions/TransactionRow';
import { useLocalStorageList } from './expenses/useLocalStorageList';

const Income: React.FC = () => {
  const [categories, setCategories] = useLocalStorageList('bb_income_categories', [
    "Salary", "Freelance", "Investment", "Business", "Other Income"
  ]);
  const [accounts, setAccounts] = useLocalStorageList('bb_accounts', [
    "Checking", "Savings", "Credit Card", "Investment Account", "Emergency Fund", "Business Account"
  ]);
  
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [pendingRowForCategory, setPendingRowForCategory] = useState<string | null>(null);

  const [showAddAccount, setShowAddAccount] = useState(false);
  const [newAccount, setNewAccount] = useState('');
  const [pendingRowForAccount, setPendingRowForAccount] = useState<string | null>(null);

  const [rows, setRows] = useState<Transaction[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);

  // Initialize rows when categories and accounts are available, and load from localStorage
  useEffect(() => {
    if (categories.length > 0 && accounts.length > 0) {
      try {
        const stored = localStorage.getItem('bb_tx_income');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Ensure each row has a valid date and account
            const rowsWithDates = parsed.map(row => ({
              ...row,
              date: row.date || new Date().toISOString().split('T')[0],
              account: row.account || accounts[0] || 'Checking',
              type: 'income' as const
            }));
            setRows(rowsWithDates);
          } else {
            // No stored rows, create initial row
            setRows([{
              id: 'inc-1',
              date: new Date().toISOString().split('T')[0],
              account: accounts[0] || 'Checking',
              category: categories[0] || 'Salary',
              payee: '',
              amount: 0,
              type: 'income' as const
            }]);
          }
        } else {
          // No stored data, create initial row
          setRows([{
            id: 'inc-1',
            date: new Date().toISOString().split('T')[0],
            account: accounts[0] || 'Checking',
            category: categories[0] || 'Salary',
            payee: '',
            amount: 0,
            type: 'income' as const
          }]);
        }
      } catch (error) {
        console.error('Error loading income from localStorage:', error);
        // Error loading from localStorage, create initial row
        setRows([{
          id: 'inc-1',
          date: new Date().toISOString().split('T')[0],
          account: accounts[0] || 'Checking',
          category: categories[0] || 'Salary',
          payee: '',
          amount: 0,
          type: 'income' as const
        }]);
      }
    }
  }, [categories, accounts]);

  // persist rows and notify listeners
  useEffect(() => {
    try { localStorage.setItem('bb_tx_income', JSON.stringify(rows)); } catch {}
    try { window.dispatchEvent(new Event('bb:income-updated')); } catch {}
  }, [rows]);

  const payeeSuggestions = useMemo(() => {
    const set = new Set<string>();
    rows.forEach(r => { if (r.payee?.trim()) set.add(r.payee.trim()); });
    return Array.from(set).slice(-25);
  }, [rows]);

  const totalIncome = useMemo(() => {
    return rows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  }, [rows]);

  const addNewCategory = () => {
    const c = newCategory.trim();
    if (!c || categories.includes(c)) return;
    setCategories([...categories, c]);
    if (pendingRowForCategory) {
      setRows(prev => prev.map(r => r.id === pendingRowForCategory ? { ...r, category: c } : r));
      setPendingRowForCategory(null);
    }
    setNewCategory('');
    setShowAddCategory(false);
  };

  const addNewAccount = () => {
    const a = newAccount.trim();
    if (!a || accounts.includes(a)) return;
    setAccounts([...accounts, a]);
    if (pendingRowForAccount) {
      setRows(prev => prev.map(r => r.id === pendingRowForAccount ? { ...r, account: a } : r));
      setPendingRowForAccount(null);
    }
    setNewAccount('');
    setShowAddAccount(false);
  };

  const removeCategory = (name: string) => {
    if (!name) return;
    if (categories.length <= 1) return;
    if (rows.some(r => r.category === name)) return;
    setCategories(categories.filter(c => c !== name));
  };

  const removeAccount = (name: string) => {
    if (!name) return;
    if (accounts.length <= 1) return;
    if (rows.some(r => r.account === name)) return;
    setAccounts(accounts.filter(a => a !== name));
  };

  const handleChange = (id: string, patch: Partial<Transaction>) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, ...patch } : r));
  };

  const handleAdd = () => {
    setRows(prev => ([...prev, {
      id: `inc-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      account: accounts[0] || 'Checking',
      category: categories[0] || 'Salary',
      payee: '',
      amount: 0,
      type: 'income' as const
    }]));
  };

  const handleRemove = (id: string) => {
    setRows(prev => prev.length > 1 ? prev.filter(r => r.id !== id) : prev);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <h2 style={{ margin: 0 }}>Source Income</h2>
        <button
          onClick={() => setIsExpanded(v => !v)}
          style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', color: '#1f2937', fontWeight: '500' }}
        >
          {isExpanded ? 'Hide' : 'Show'} Income
        </button>
      </div>

      {(showAddCategory || showAddAccount) && isExpanded && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          {showAddCategory && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', border: '1px solid #e5e7eb', borderRadius: 8, padding: 8 }}>
              <span style={{ fontWeight: 600 }}>New income category:</span>
              <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="Category name" style={{ padding: '6px 10px', border: '1px solid #ced4da', borderRadius: 6 }} onKeyDown={(e) => { if (e.key === 'Enter') addNewCategory(); if (e.key === 'Escape') setShowAddCategory(false); }} />
              <button onClick={addNewCategory} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#0ea5e9', color: '#fff' }}>Add</button>
              <button onClick={() => { setShowAddCategory(false); setPendingRowForCategory(null); }} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', color: '#1f2937' }}>Cancel</button>
              <button onClick={() => removeCategory(newCategory.trim())} disabled={!newCategory.trim() || rows.some(r => r.category === newCategory.trim()) || categories.length <= 1} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#dc2626', color: '#fff' }}>Remove</button>
            </div>
          )}
          {showAddAccount && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', border: '1px solid #e5e7eb', borderRadius: 8, padding: 8 }}>
              <span style={{ fontWeight: 600 }}>New account:</span>
              <input type="text" value={newAccount} onChange={(e) => setNewAccount(e.target.value)} placeholder="Account name" style={{ padding: '6px 10px', border: '1px solid #ced4da', borderRadius: 6 }} onKeyDown={(e) => { if (e.key === 'Enter') addNewAccount(); if (e.key === 'Escape') setShowAddAccount(false); }} />
              <button onClick={addNewAccount} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#0ea5e9', color: '#fff' }}>Add</button>
              <button onClick={() => { setShowAddAccount(false); setPendingRowForAccount(null); }} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', color: '#1f2937' }}>Cancel</button>
              <button onClick={() => removeAccount(newAccount.trim())} disabled={!newAccount.trim() || rows.some(r => r.account === newAccount.trim()) || accounts.length <= 1} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#dc2626', color: '#fff' }}>Remove</button>
            </div>
          )}
        </div>
      )}

      {isExpanded && (
        <div style={{ display: 'grid', gap: 8 }}>
          {rows.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              <div>No income sources yet.</div>
              <button
                onClick={() => {
                  const newRow = {
                    id: `inc-${Date.now()}`,
                    date: new Date().toISOString().split('T')[0],
                    account: accounts[0] || 'Checking',
                    category: categories[0] || 'Salary',
                    payee: '',
                    amount: 0,
                    type: 'income' as const
                  };
                  setRows([newRow]);
                }}
                style={{
                  marginTop: '10px',
                  padding: '8px 16px',
                  background: '#0ea5e9',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer'
                }}
              >
                Create First Income Source
              </button>
      </div>
          ) : (
                         rows.map((row) => (
              <TransactionRow
                key={row.id}
                value={row}
                categories={categories}
                accounts={accounts}
                payeeSuggestions={payeeSuggestions}
                onChange={handleChange}
                onAdd={handleAdd}
                onRemove={handleRemove}
                onNewCategoryRequested={(id) => { setPendingRowForCategory(id); setShowAddCategory(true); }}
                onNewAccountRequested={(id) => { setPendingRowForAccount(id); setShowAddAccount(true); }}
                lineBalance={0} // Income doesn't need running balance
                isIncome={true}
              />
            ))
          )}
        </div>
      )}

      <div style={{ marginTop: 16, fontWeight: "bold", textAlign: "center" }}>
        Total Income: ${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </div>
    </div>
  );
};

export default Income;
