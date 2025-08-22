import React, { useMemo, useState, useEffect } from 'react';
import TransactionRow, { type Transaction } from './TransactionRow';
import { useLocalStorageList } from '../expenses/useLocalStorageList';

const DEFAULT_ACCOUNTS = ["Checking", "Savings", "Credit Card"];

const Transactions: React.FC = () => {
  const [categories, setCategories] = useLocalStorageList('bb_categories', []);
  const [accounts, setAccounts] = useLocalStorageList('bb_accounts', DEFAULT_ACCOUNTS);

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [pendingRowForCategory, setPendingRowForCategory] = useState<string | null>(null);

  const [showAddAccount, setShowAddAccount] = useState(false);
  const [newAccount, setNewAccount] = useState('');
  const [pendingRowForAccount, setPendingRowForAccount] = useState<string | null>(null);

  const [rows, setRows] = useState<Transaction[]>([{
    id: 't-1',
    date: new Date().toISOString().split('T')[0],
    account: 'Checking',
    category: '',
    payee: '',
    amount: 0,
  }]);

  // simple payee suggestions from historical rows
  const payeeSuggestions = useMemo(() => {
    const set = new Set<string>();
    rows.forEach(r => { if (r.payee?.trim()) set.add(r.payee.trim()); });
    return Array.from(set).slice(-25);
  }, [rows]);

  // Inline add-only flow (no managers panel)

  // Persist transactions
  useEffect(() => {
    try { localStorage.setItem('bb_transactions', JSON.stringify(rows)); } catch {}
  }, [rows]);

  useEffect(() => {
    try { 
      const stored = localStorage.getItem('bb_transactions');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setRows(parsed);
      }
    } catch {}
  }, []);

  // Category helpers
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

  const removeCategory = (name: string) => {
    if (!name) return;
    if (categories.length <= 1) return;
    if (rows.some(r => r.category === name)) return;
    setCategories(categories.filter(c => c !== name));
  };

  // Account helpers
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

  const removeAccount = (name: string) => {
    if (!name) return;
    if (accounts.length <= 1) return;
    if (rows.some(r => r.account === name)) return;
    setAccounts(accounts.filter(a => a !== name));
  };

  const getAccentColor = () => '#0ea5e9';


  // Derived balances by account
  const runningBalances = useMemo(() => {
    const map = new Map<string, number>();
    accounts.forEach(a => map.set(a, 0));
    const balances: number[] = [];
    for (const r of rows) {
      const prev = map.get(r.account) ?? 0;
      const next = prev - (Number(r.amount) || 0);
      map.set(r.account, next);
      balances.push(next);
    }
    return balances;
  }, [rows, accounts]);

  const handleChange = (id: string, patch: Partial<Transaction>) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, ...patch } : r));
  };

  const handleAdd = () => {
    setRows(prev => ([...prev, {
      id: `t-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      account: (accounts.includes('Checking') ? 'Checking' : (accounts[0] ?? 'Checking')),
      category: categories[0] ?? '',
      payee: '',
      amount: 0,
    }]));
  };

  const handleRemove = (id: string) => {
    setRows(prev => prev.length > 1 ? prev.filter(r => r.id !== id) : prev);
  };

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ marginBottom: 12, color: getAccentColor() }}>Transactions</h2>

      {(showAddCategory || showAddAccount) && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          {showAddCategory && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', border: '1px solid #e5e7eb', borderRadius: 8, padding: 8 }}>
              <span style={{ fontWeight: 600 }}>New category:</span>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Category name"
                style={{ padding: '6px 10px', border: '1px solid #ced4da', borderRadius: 6 }}
                onKeyDown={(e) => { if (e.key === 'Enter') addNewCategory(); if (e.key === 'Escape') setShowAddCategory(false); }}
              />
              <button onClick={addNewCategory} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #e5e7eb', background: getAccentColor(), color: '#fff' }}>Add</button>
              <button onClick={() => { setShowAddCategory(false); setPendingRowForCategory(null); }} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #e5e7eb' }}>Cancel</button>
              <button onClick={() => removeCategory(newCategory.trim())} disabled={!newCategory.trim() || rows.some(r => r.category === newCategory.trim()) || categories.length <= 1} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#dc2626', color: '#fff' }}>Remove</button>
            </div>
          )}
          {showAddAccount && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', border: '1px solid #e5e7eb', borderRadius: 8, padding: 8 }}>
              <span style={{ fontWeight: 600 }}>New account:</span>
              <input
                type="text"
                value={newAccount}
                onChange={(e) => setNewAccount(e.target.value)}
                placeholder="Account name"
                style={{ padding: '6px 10px', border: '1px solid #ced4da', borderRadius: 6 }}
                onKeyDown={(e) => { if (e.key === 'Enter') addNewAccount(); if (e.key === 'Escape') setShowAddAccount(false); }}
              />
              <button onClick={addNewAccount} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #e5e7eb', background: getAccentColor(), color: '#fff' }}>Add</button>
              <button onClick={() => { setShowAddAccount(false); setPendingRowForAccount(null); }} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #e5e7eb' }}>Cancel</button>
              <button onClick={() => removeAccount(newAccount.trim())} disabled={!newAccount.trim() || rows.some(r => r.account === newAccount.trim()) || accounts.length <= 1} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#dc2626', color: '#fff' }}>Remove</button>
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'grid', gap: 8 }}>
        {rows.map((row, idx) => (
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
            lineBalance={runningBalances[idx] ?? 0}
          />
        ))}
      </div>
    </div>
  );
};

export default Transactions;


