import React, { useEffect, useMemo, useState } from 'react';
import TransactionRow, { type Transaction } from './transactions/TransactionRow';

import { useLocalStorageList } from './expenses/useLocalStorageList';

const FixedExpenses: React.FC = () => {
  const [categories, setCategories] = useLocalStorageList('bb_expense_categories', [
    "Housing",
    "Utilities", 
    "Transportation",
    "Food & Dining",
    "Healthcare",
    "Insurance",
    "Debt Payments",
    "Entertainment",
    "Shopping",
    "Education",
    "Gifts & Donations",
    "Personal Care",
    "Subscriptions",
    "Other"
  ]);
  const [accounts, setAccounts] = useLocalStorageList('bb_accounts', [
    "Checking", 
    "Savings", 
    "Credit Card",
    "Investment Account",
    "Emergency Fund",
    "Business Account"
  ]);

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [pendingRowForCategory, setPendingRowForCategory] = useState<string | null>(null);

  const [showAddAccount, setShowAddAccount] = useState(false);
  const [newAccount, setNewAccount] = useState('');
  const [pendingRowForAccount, setPendingRowForAccount] = useState<string | null>(null);

  // Per-account starting balances (shared key across app)
  const [accountBalances, setAccountBalances] = useState<Record<string, number>>({});
  const [selectedBalanceAccount, setSelectedBalanceAccount] = useState<string>('Checking');
  const [balanceInput, setBalanceInput] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem('bb_account_balances');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          console.log('Loaded stored account balances:', parsed);
          setAccountBalances(parsed);
        }
      } else {
        console.log('No stored account balances found, starting with empty balances');
        setAccountBalances({});
      }
    } catch (error) {
      console.error('Error loading account balances:', error);
      setAccountBalances({});
    }
    
    const updateAccountBalancesFromIncome = () => {
      try {
        const incomeTransactions = JSON.parse(localStorage.getItem('bb_tx_income') || '[]');
        console.log('Income transactions found:', incomeTransactions);
        
        // Only update if we have income transactions and no existing balances
        if (incomeTransactions.length > 0) {
          setAccountBalances(prevBalances => {
            // If we already have balances, don't add income again
            if (Object.keys(prevBalances).length > 0) {
              console.log('Account balances already exist, skipping income addition');
              return prevBalances;
            }
            
            const newBalances = { ...prevBalances };
            
            // Add income to the specified accounts (only once)
            incomeTransactions.forEach((income: any) => {
              if (income.account && income.amount) {
                const account = income.account;
                const amount = Number(income.amount) || 0;
                console.log(`Adding ${amount} to ${account} account`);
                newBalances[account] = (newBalances[account] || 0) + amount;
              }
            });
            
            console.log('Updated account balances:', newBalances);
            return newBalances;
          });
        }
      } catch (error) {
        console.error('Error updating account balances from income:', error);
      }
    };
    
    // Update balances when income changes
    const onIncome = () => updateAccountBalancesFromIncome();
    window.addEventListener('bb:income-updated', onIncome);
    
    // Listen for account balance updates from other components
    const onAccountBalancesUpdated = (event: CustomEvent) => {
      console.log('FixedExpenses - Received account balance update from other component:', event.detail);
      setAccountBalances(event.detail);
    };
    window.addEventListener('bb:account-balances-updated', onAccountBalancesUpdated as EventListener);
    
    // Initial update
    updateAccountBalancesFromIncome();
    
    return () => {
      window.removeEventListener('bb:income-updated', onIncome);
      window.removeEventListener('bb:account-balances-updated', onAccountBalancesUpdated as EventListener);
    };
  }, []); // Remove accountBalances dependency to prevent infinite loops

  useEffect(() => {
    try { localStorage.setItem('bb_account_balances', JSON.stringify(accountBalances)); } catch {}
    
    // Notify other components that account balances have changed
    try { window.dispatchEvent(new CustomEvent('bb:account-balances-updated', { detail: accountBalances })); } catch {}
  }, [accountBalances]);

  useEffect(() => {
    if (!selectedBalanceAccount || !accounts.includes(selectedBalanceAccount)) {
      setSelectedBalanceAccount(accounts.includes('Checking') ? 'Checking' : (accounts[0] ?? ''));
    }
  }, [accounts, selectedBalanceAccount]);

  // keep input text in sync when switching accounts/balances
  useEffect(() => {
    const balanceValue = String(accountBalances[selectedBalanceAccount] ?? '');
    console.log(`Syncing balance input for ${selectedBalanceAccount}:`, balanceValue, 'from accountBalances:', accountBalances);
    setBalanceInput(prev => ({
      ...prev,
      [selectedBalanceAccount]: balanceValue,
    }));
  }, [selectedBalanceAccount, accountBalances]);

  const [rows, setRows] = useState<Transaction[]>([]);

  // Initialize rows when categories and accounts are available, and load from localStorage
  useEffect(() => {
    if (categories.length > 0 && accounts.length > 0) {
      console.log('Initializing rows with categories:', categories, 'accounts:', accounts);
      try {
        const stored = localStorage.getItem('bb_tx_fixed');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Ensure each row has a valid date and account
            const rowsWithDates = parsed.map(row => ({
              ...row,
              date: row.date || new Date().toISOString().split('T')[0],
              account: row.account || accounts[0] || 'Checking'
            }));
            console.log('Loaded stored rows:', rowsWithDates);
            setRows(rowsWithDates);
          } else {
            // No stored rows, create initial row
            const initialRow = {
              id: 'fx-1',
              date: new Date().toISOString().split('T')[0],
              account: accounts[0] || 'Checking', // Use first available account
              category: categories[0], // Use first category
              payee: '',
              amount: 0,
            };
            console.log('Creating initial row:', initialRow);
            setRows([initialRow]);
          }
        } else {
          // No stored data, create initial row
          const initialRow = {
            id: 'fx-1',
            date: new Date().toISOString().split('T')[0],
            account: accounts[0] || 'Checking', // Use first available account
            category: categories[0], // Use first category
            payee: '',
            amount: 0,
          };
          console.log('Creating initial row (no stored data):', initialRow);
          setRows([initialRow]);
        }
      } catch (error) {
        console.error('Error loading from localStorage:', error);
        // Error loading from localStorage, create initial row
        const initialRow = {
          id: 'fx-1',
          date: new Date().toISOString().split('T')[0],
          account: accounts[0] || 'Checking', // Use first available account
          category: categories[0], // Use first category
          payee: '',
          amount: 0,
        };
        console.log('Creating initial row (error case):', initialRow);
        setRows([initialRow]);
      }
    }
  }, [categories, accounts]);

  // persist rows and notify listeners
  useEffect(() => {
    try { localStorage.setItem('bb_tx_fixed', JSON.stringify(rows)); } catch {}
    try { window.dispatchEvent(new Event('bb:transactions-updated')); } catch {}
  }, [rows]);

  const payeeSuggestions = useMemo(() => {
    const set = new Set<string>();
    rows.forEach(r => { if (r.payee?.trim()) set.add(r.payee.trim()); });
    return Array.from(set).slice(-25);
  }, [rows]);

  const runningBalances = useMemo(() => {
    const map = new Map<string, number>();
    accounts.forEach(a => map.set(a, Number(accountBalances[a] ?? 0)));
    return rows.map(r => {
      const prev = map.get(r.account) ?? 0;
      const next = prev - (Number(r.amount) || 0);
      map.set(r.account, next);
      return next;
    });
  }, [rows, accounts, accountBalances]);

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
    setAccountBalances(prev => ({ ...prev, [a]: prev[a] ?? 0 }));
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
    setAccountBalances(prev => {
      const { [name]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleChange = (id: string, patch: Partial<Transaction>) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, ...patch } : r));
  };

  const handleAdd = (afterId?: string) => {
    if (afterId) {
      const row = rows.find(r => r.id === afterId);
      if (row && row.account) {
        setAccountBalances(prev => ({
          ...prev,
          [row.account]: (Number(prev[row.account] ?? 0)) - (Number(row.amount) || 0),
        }));
      }
    }
    setRows(prev => ([...prev, {
      id: `fx-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      account: accounts[0] || 'Checking', // Use first available account
      category: categories[0] || 'Housing', // Use first category or fallback to Housing
      payee: '',
      amount: 0,
    }]));
  };

  const handleRemove = (id: string) => {
    setRows(prev => prev.length > 1 ? prev.filter(r => r.id !== id) : prev);
  };

  const [isExpanded, setIsExpanded] = useState(true);

  // Debug logging
  console.log('FixedExpenses render - rows:', rows, 'isExpanded:', isExpanded, 'categories:', categories, 'accounts:', accounts);
  console.log('Current account balances:', accountBalances);
  console.log('Selected balance account:', selectedBalanceAccount);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <h2 style={{ margin: 0 }}>Fixed Expenses</h2>
        <button
          onClick={() => setIsExpanded(v => !v)}
          style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', color: '#1f2937', fontWeight: '500' }}
        >
          {isExpanded ? 'Hide' : 'Show'} Transactions
        </button>
      </div>

      {/* Account balance editor */}
      {accounts.length > 0 && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
          <strong>Account Balance:</strong>
          <select
            value={selectedBalanceAccount || ''}
            onChange={(e) => setSelectedBalanceAccount(e.target.value)}
            style={{ padding: '6px 10px', border: '1px solid #ced4da', borderRadius: 6 }}
          >
            {accounts.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
          <input
            type="text"
            value={balanceInput[selectedBalanceAccount] ?? ''}
            onChange={(e) => {
              const raw = e.target.value;
              // allow only -, digits, optional dot
              const valid = /^-?\d*(\.\d*)?$/.test(raw);
              if (!valid && raw !== '') return;
              // strip leading zeros (preserve 0.xxx and -0.xxx)
              let cleaned = raw;
              cleaned = cleaned.replace(/^(\d)(?=\d)/, '$1');
              if (/^-?0+\d/.test(cleaned)) {
                cleaned = cleaned.replace(/^(-?)0+(?=\d)/, '$1');
              }
              setBalanceInput(prev => ({ ...prev, [selectedBalanceAccount]: cleaned }));
            }}
            onBlur={() => {
              const raw = balanceInput[selectedBalanceAccount] ?? '';
              const num = raw === '' || raw === '-' || raw === '.' || raw === '-.' ? 0 : parseFloat(raw);
              setAccountBalances(prev => ({ ...prev, [selectedBalanceAccount]: isNaN(num) ? 0 : num }));
              setBalanceInput(prev => ({ ...prev, [selectedBalanceAccount]: String(isNaN(num) ? 0 : num) }));
            }}
            style={{ padding: '6px 10px', border: '1px solid #ced4da', borderRadius: 6, width: 140 }}
          />
          
          {/* Debug info */}
          <div style={{ fontSize: '12px', color: '#666', marginLeft: '20px' }}>
            <div>Income in localStorage: {(() => {
              try {
                const income = JSON.parse(localStorage.getItem('bb_tx_income') || '[]');
                return income.length > 0 ? `${income.length} transactions` : 'None';
              } catch { return 'Error reading'; }
            })()}</div>
            <div>Current balances: {JSON.stringify(accountBalances)}</div>
            <div>Raw income data: {(() => {
              try {
                const income = JSON.parse(localStorage.getItem('bb_tx_income') || '[]');
                return JSON.stringify(income.slice(0, 3)); // Show first 3 transactions
              } catch { return 'Error reading'; }
            })()}</div>
            <button 
              onClick={() => {
                try {
                  const incomeTransactions = JSON.parse(localStorage.getItem('bb_tx_income') || '[]');
                  console.log('Manual refresh - Income transactions found:', incomeTransactions);
                  
                  setAccountBalances(prevBalances => {
                    const newBalances = { ...prevBalances };
                    
                    // Add income to the specified accounts
                    incomeTransactions.forEach((income: any) => {
                      if (income.account && income.amount) {
                        const account = income.account;
                        const amount = Number(income.amount) || 0;
                        console.log(`Manual refresh - Adding ${amount} to ${account} account`);
                        newBalances[account] = (newBalances[account] || 0) + amount;
                      }
                    });
                    
                    console.log('Manual refresh - Updated account balances:', newBalances);
                    return newBalances;
                  });
                } catch (error) {
                  console.error('Manual refresh - Error updating account balances from income:', error);
                }
              }}
              style={{ 
                fontSize: '10px', 
                padding: '2px 6px', 
                background: '#0ea5e9', 
                color: '#fff', 
                border: 'none', 
                borderRadius: 4,
                cursor: 'pointer',
                marginTop: '4px'
              }}
            >
              Refresh Balances
            </button>
            <button 
              onClick={() => {
                // Reset all account balances to 0
                setAccountBalances({});
                localStorage.removeItem('bb_account_balances');
                console.log('Reset all account balances to 0');
              }}
              style={{ 
                fontSize: '10px', 
                padding: '2px 6px', 
                background: '#dc2626', 
                color: '#fff', 
                border: 'none', 
                borderRadius: 4,
                cursor: 'pointer',
                marginTop: '4px',
                marginLeft: '4px'
              }}
            >
              Reset Balances
            </button>
            <button 
              onClick={() => {
                // Force sync with other components
                try { window.dispatchEvent(new CustomEvent('bb:account-balances-updated', { detail: accountBalances })); } catch {}
                console.log('Forced sync with other components');
              }}
              style={{ 
                fontSize: '10px', 
                padding: '2px 6px', 
                background: '#f59e0b', 
                color: '#fff', 
                border: 'none', 
                borderRadius: 4,
                cursor: 'pointer',
                marginTop: '4px',
                marginLeft: '4px'
              }}
            >
              Force Sync
            </button>
          </div>
        </div>
      )}

      {(showAddCategory || showAddAccount) && isExpanded && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          {showAddCategory && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', border: '1px solid #e5e7eb', borderRadius: 8, padding: 8 }}>
              <span style={{ fontWeight: 600 }}>New category:</span>
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
              <div>No transactions yet.</div>
              <button 
                onClick={() => {
                  const newRow = {
                    id: `fx-${Date.now()}`,
                    date: new Date().toISOString().split('T')[0],
                    account: accounts[0] || 'Checking',
                    category: categories[0] || 'Housing',
                    payee: '',
                    amount: 0,
                  };
                  console.log('Manually creating row:', newRow);
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
                Create First Transaction
              </button>
            </div>
          ) : (
            rows.map((row, idx) => (
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
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default FixedExpenses;
