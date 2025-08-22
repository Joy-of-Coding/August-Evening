

import { useState, useEffect } from "react";
import DatePicker from "./DatePicker";

interface Goal {
  name: string;
  target: number;
  current: number;
  date: string;
  pointsCalculation?: string;
}

const SavingGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([
    { name: "", target: 0, current: 0, date: "" },
  ]);

  // Account balances and transfer state
  const [accountBalances, setAccountBalances] = useState<Record<string, number>>({});
  const [accounts, setAccounts] = useState<string[]>([]);
  const [transferAmount, setTransferAmount] = useState<string>("");
  const [selectedAccount, setSelectedAccount] = useState<string>("");

  // Load account balances and accounts from localStorage
  useEffect(() => {
    try {
      // Load account balances
      const storedBalances = localStorage.getItem('bb_account_balances');
      if (storedBalances) {
        const parsed = JSON.parse(storedBalances);
        if (parsed && typeof parsed === 'object') {
          setAccountBalances(parsed);
        }
      }

      // Load accounts
      const storedAccounts = localStorage.getItem('bb_accounts');
      if (storedAccounts) {
        const parsed = JSON.parse(storedAccounts);
        if (Array.isArray(parsed)) {
          setAccounts(parsed);
          if (parsed.length > 0) {
            setSelectedAccount(parsed[0]);
          }
        }
      }

      // Load saved goals
      const storedGoals = localStorage.getItem('bb_savings_goals');
      if (storedGoals) {
        const parsed = JSON.parse(storedGoals);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setGoals(parsed);
        }
      }
    } catch (error) {
      console.error('Error loading account data:', error);
    }
  }, []);

  // Save goals to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('bb_savings_goals', JSON.stringify(goals));
    } catch (error) {
      console.error('Error saving goals:', error);
    }
  }, [goals]);

  // Listen for account balance updates from other components
  useEffect(() => {
    const onAccountBalancesUpdated = (event: CustomEvent) => {
      console.log('SavingGoals - Received account balance update:', event.detail);
      setAccountBalances(event.detail);
    };
    
    window.addEventListener('bb:account-balances-updated', onAccountBalancesUpdated as EventListener);
    
    return () => {
      window.removeEventListener('bb:account-balances-updated', onAccountBalancesUpdated as EventListener);
    };
  }, []);

  // Handlers for inline editing
  const handleChange = (index: number, field: keyof Goal, value: string) => {
    setGoals(goals => goals.map((goal, i) =>
      i === index ? { ...goal, [field]: field === "target" || field === "current" ? Number(value) : value } : goal
    ));
  };

  // Handle money transfer to savings goal
  const handleTransfer = (goalIndex: number) => {
    const amount = parseFloat(transferAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid transfer amount');
      return;
    }

    if (!selectedAccount) {
      alert('Please select an account to transfer from');
      return;
    }

    const currentBalance = accountBalances[selectedAccount] || 0;
    if (amount > currentBalance) {
      alert(`Insufficient funds in ${selectedAccount}. Available: $${currentBalance.toFixed(2)}`);
      return;
    }

    // Get the goal name for the goal account
    const goalName = goals[goalIndex].name || `Goal ${goalIndex + 1}`;
    const goalAccountName = `${goalName} Account`;

    // Update the goal's current amount
    setGoals(prevGoals => prevGoals.map((goal, i) =>
      i === goalIndex ? { ...goal, current: goal.current + amount } : goal
    ));

    // Update account balances - decrease from source account, increase goal account
    const newBalances = { ...accountBalances };
    newBalances[selectedAccount] = currentBalance - amount;
    
    // Create or update the goal account
    if (!newBalances[goalAccountName]) {
      newBalances[goalAccountName] = 0;
    }
    newBalances[goalAccountName] += amount;
    
    setAccountBalances(newBalances);

    // Save to localStorage
    try {
      localStorage.setItem('bb_account_balances', JSON.stringify(newBalances));
      // Notify other components
      window.dispatchEvent(new CustomEvent('bb:account-balances-updated', { detail: newBalances }));
    } catch (error) {
      console.error('Error saving account balances:', error);
    }

    // Clear transfer amount
    setTransferAmount("");
    
    console.log(`Transferred $${amount} from ${selectedAccount} to ${goalAccountName}`);
    alert(`Successfully transferred $${amount} to ${goalAccountName}! This money is now earmarked for your goal and unavailable for spending.`);
  };

  const addGoal = (index: number) => {
    setGoals(goals => [
      ...goals.slice(0, index + 1),
      { name: "", target: 0, current: 0, date: "" },
      ...goals.slice(index + 1),
    ]);
  };

  const removeGoal = (index: number) => {
    if (goals.length === 1) return;
    setGoals(goals => goals.filter((_, i) => i !== index));
  };

  return (
    <div style={{ 
      maxWidth: "100%", 
      margin: "0 auto",
      padding: "0 16px",
      boxSizing: "border-box",
      overflow: "hidden"
    }}>
      <h2 style={{ marginBottom: "16px", fontSize: "1.5rem" }}>Saving Goals</h2>
      
      {/* Transfer Controls */}
      <div style={{ 
        display: "flex", 
        flexDirection: "column",
        gap: 8, 
        marginBottom: 16, 
        padding: "12px", 
        background: "#f8fafc", 
        borderRadius: "8px",
        border: "1px solid #e2e8f0"
      }}>
        <div style={{ fontWeight: 600, color: "#374151" }}>Transfer to Goals:</div>
        
        <div style={{ 
          display: "flex", 
          flexWrap: "wrap", 
          gap: 8, 
          alignItems: "center" 
        }}>
          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            style={{ 
              padding: "6px 10px", 
              border: "1px solid #d1d5db", 
              borderRadius: "6px",
              background: "white",
              minWidth: "120px"
            }}
          >
            {accounts.map(account => (
              <option key={account} value={account}>
                {account} (${(accountBalances[account] || 0).toFixed(2)})
              </option>
            ))}
          </select>
          
          <input
            type="text"
            placeholder="Amount"
            value={transferAmount}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "" || /^\d*\.?\d{0,2}$/.test(val)) {
                setTransferAmount(val);
              }
            }}
            style={{ 
              padding: "6px 10px", 
              border: "1px solid #d1d5db", 
              borderRadius: "6px",
              width: "100px",
              background: "white"
            }}
          />
          
          <span style={{ fontSize: "14px", color: "#6b7280" }}>
            Available: ${(accountBalances[selectedAccount] || 0).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Goals Summary */}
      <div style={{ 
        display: "flex", 
        flexDirection: "column",
        gap: 8,
        marginBottom: 16, 
        padding: "12px", 
        background: "#ecfdf5", 
        borderRadius: "8px",
        border: "1px solid #d1fae5",
        color: "#222"
      }}>
        <div style={{ 
          display: "flex", 
          flexDirection: "column",
          gap: 4
        }}>
          <div><strong>Total Goals Progress:</strong>
            <span style={{ marginLeft: 8, color: "#006e40ff", fontWeight: 600 }}>
              ${goals.reduce((sum, goal) => sum + goal.current, 0).toFixed(2)} / ${goals.reduce((sum, goal) => sum + goal.target, 0).toFixed(2)}
            </span>
          </div>
          <div><strong>Remaining:</strong>
            <span style={{ marginLeft: 8, color: "#7c1c1c", fontWeight: 600 }}>
              ${goals.reduce((sum, goal) => sum + Math.max(0, goal.target - goal.current), 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Debug Info */}
      <div style={{ 
        marginBottom: 16, 
        padding: "12px", 
        background: "#fef3c7", 
        borderRadius: "8px",
        border: "1px solid #f59e0b",
        fontSize: "12px"
      }}>
        <div><strong>Debug Info:</strong></div>
        <div>Selected Account: {selectedAccount}</div>
        <div>Account Balances: {JSON.stringify(accountBalances)}</div>
        <div>Available Accounts: {accounts.join(', ')}</div>
        <button 
          onClick={() => {
            console.log('SavingGoals - Current account balances:', accountBalances);
            console.log('SavingGoals - Selected account:', selectedAccount);
            console.log('SavingGoals - Available accounts:', accounts);
            
            // Test the event system
            try {
              const testBalances = { ...accountBalances };
              testBalances[selectedAccount] = (testBalances[selectedAccount] || 0) + 0.01;
              console.log('SavingGoals - Testing event system with:', testBalances);
              window.dispatchEvent(new CustomEvent('bb:account-balances-updated', { detail: testBalances }));
            } catch (error) {
              console.error('SavingGoals - Error testing event system:', error);
            }
          }}
          style={{ 
            fontSize: '10px', 
            padding: '2px 6px', 
            background: '#f59e0b', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '4px'
          }}
        >
          Test Sync
        </button>
      </div>

      {/* Goal Accounts Summary */}
      <div style={{ 
        marginBottom: 16, 
        padding: "12px", 
        background: "#e0f2fe", 
        borderRadius: "8px",
        border: "1px solid #0288d1"
      }}>
        <h3 style={{ margin: "0 0 12px 0", color: "#0277bd", fontSize: "1.1rem" }}>Goal Accounts (Earmarked Money)</h3>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", 
          gap: "8px",
          maxWidth: "100%"
        }}>
          {goals.map((goal, idx) => {
            const goalAccountName = `${goal.name || `Goal ${idx + 1}`} Account`;
            const goalBalance = accountBalances[goalAccountName] || 0;
            return (
              <div key={idx} style={{ 
                padding: "8px", 
                background: "white", 
                borderRadius: "6px", 
                border: "1px solid #b3e5fc",
                fontSize: "11px",
                wordBreak: "break-word"
              }}>
                <div style={{ fontWeight: "600", color: "#0277bd" }}>{goal.name || `Goal ${idx + 1}`}</div>
                <div style={{ color: "#01579b", fontSize: "10px" }}>
                  Account: {goalAccountName}
                </div>
                <div style={{ 
                  fontSize: "13px", 
                  fontWeight: "600", 
                  color: goalBalance > 0 ? "#2e7d32" : "#666",
                  marginTop: "4px"
                }}>
                  Balance: ${goalBalance.toFixed(2)}
                </div>
                <div style={{ fontSize: "9px", color: "#666", marginTop: "2px" }}>
                  {goalBalance > 0 ? "💰 Money earmarked - unavailable for spending" : "No money earmarked yet"}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Labels Row */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "2fr 1fr 1fr 2fr 2fr 1fr auto",
        gap: "8px",
        marginBottom: 4,
        fontSize: "12px",
        fontWeight: "600"
      }}>
        <div>Name</div>
        <div>Target</div>
        <div>Current</div>
        <div>Goal Date</div>
        <div>Progress</div>
        <div>Transfer</div>
        <div style={{ width: "48px" }}></div>
      </div>
      {goals.map((goal, idx) => {
        const progress = goal.target > 0 ? Math.min((goal.current / goal.target) * 100, 100) : 0;
        return (
          <div key={idx} style={{ 
            display: "grid", 
            gridTemplateColumns: "2fr 1fr 1fr 2fr 2fr 1fr auto",
            gap: "8px",
            marginBottom: 8,
            alignItems: "center"
          }}>
            <input
              type="text"
              placeholder="Name"
              value={goal.name}
              onChange={e => handleChange(idx, "name", e.target.value)}
              style={{ 
                padding: "6px 8px", 
                border: "1px solid #d1d5db", 
                borderRadius: "4px",
                fontSize: "12px",
                width: "100%",
                boxSizing: "border-box"
              }}
            />
            <input
              type="number"
              placeholder="Target"
              value={goal.target}
              onChange={e => handleChange(idx, "target", e.target.value)}
              style={{ 
                padding: "6px 8px", 
                border: "1px solid #d1d5db", 
                borderRadius: "4px",
                fontSize: "12px",
                width: "100%",
                boxSizing: "border-box"
              }}
            />
            <input
              type="number"
              placeholder="Current"
              value={goal.current}
              onChange={e => handleChange(idx, "current", e.target.value)}
              style={{ 
                padding: "6px 8px", 
                border: "1px solid #d1d5db", 
                borderRadius: "4px",
                fontSize: "12px",
                width: "100%",
                boxSizing: "border-box"
              }}
            />
            
            <div style={{ width: "100%" }}>
              <DatePicker
                label=""
                value={goal.date}
                onChange={date => handleChange(idx, "date", date)}
              />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                background: '#eee', 
                borderRadius: 8, 
                height: 16, 
                flex: 1, 
                overflow: 'hidden'
              }}>
                <div
                  style={{
                    width: `${progress}%`,
                    height: '100%',
                    background: 'green',
                    transition: 'width 0.5s',
                  }}
                />
              </div>
              <span style={{ fontSize: "11px", minWidth: "35px" }}>{progress.toFixed(1)}%</span>
            </div>
            
            {/* Transfer Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
              <button
                onClick={() => handleTransfer(idx)}
                disabled={!transferAmount || !selectedAccount || parseFloat(transferAmount) <= 0 || parseFloat(transferAmount) > (accountBalances[selectedAccount] || 0)}
                title={`Transfer $${transferAmount || '0'} from ${selectedAccount} to ${goal.name || `Goal ${idx + 1}`} Account (money will be earmarked and unavailable for spending)`}
                style={{
                  fontSize: '0.7em',
                  padding: '3px 6px',
                  background: !transferAmount || !selectedAccount || parseFloat(transferAmount) <= 0 || parseFloat(transferAmount) > (accountBalances[selectedAccount] || 0) ? '#9ca3af' : '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: !transferAmount || !selectedAccount || parseFloat(transferAmount) <= 0 || parseFloat(transferAmount) > (accountBalances[selectedAccount] || 0) ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  width: '100%'
                }}
              >
                Transfer
              </button>
              
              {/* Quick Transfer Button */}
              {goal.target > goal.current && (
                <button
                  onClick={() => {
                    const remaining = goal.target - goal.current;
                    const available = accountBalances[selectedAccount] || 0;
                    const transferAmount = Math.min(remaining, available);
                    
                    if (transferAmount > 0) {
                      setTransferAmount(transferAmount.toString());
                      setTimeout(() => handleTransfer(idx), 100);
                    }
                  }}
                  disabled={!selectedAccount || (accountBalances[selectedAccount] || 0) <= 0}
                  title={`Quick transfer remaining $${Math.min(goal.target - goal.current, accountBalances[selectedAccount] || 0).toFixed(2)} to ${goal.name || `Goal ${idx + 1}`} Account (money will be earmarked)`}
                  style={{
                    fontSize: '0.6em',
                    padding: '2px 4px',
                    background: !selectedAccount || (accountBalances[selectedAccount] || 0) <= 0 ? '#9ca3af' : '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: !selectedAccount || (accountBalances[selectedAccount] || 0) <= 0 ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    width: '100%'
                  }}
                >
                  Quick
                </button>
              )}
            </div>
            
            {/* Add/Remove Goal Buttons */}
            <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
              <button
                onClick={() => addGoal(idx)}
                title="Add goal"
                style={{ 
                  fontSize: '0.7em', 
                  padding: '2px 6px', 
                  width: 24, 
                  height: 24,
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                +
              </button>
              {idx > 0 && (
                <button
                  onClick={() => removeGoal(idx)}
                  title="Remove goal"
                  disabled={goals.length === 1}
                  style={{ 
                    fontSize: '0.7em', 
                    padding: '2px 6px', 
                    width: 24, 
                    height: 24,
                    background: goals.length === 1 ? '#9ca3af' : '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: goals.length === 1 ? 'not-allowed' : 'pointer'
                  }}
                >
                  -
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SavingGoals;
