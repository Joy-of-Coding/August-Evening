import React from 'react';
import { NEW_ACCOUNT_OPTION, NEW_CATEGORY_OPTION } from './constants';

export interface ExpenseRowValue {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  account?: string;
}

interface Props {
  value: ExpenseRowValue;
  categories: string[];
  accounts: string[];
  onChange: (id: string, patch: Partial<ExpenseRowValue>) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
  setShowAddCategory: (show: boolean) => void;
  setPendingFieldIdForNewCategory: (id: string) => void;
  setShowAddAccount: (show: boolean) => void;
  setPendingFieldIdForNewAccount: (id: string) => void;
  getAccentColor: () => string;
}

const ExpenseRow: React.FC<Props> = ({
  value,
  categories,
  accounts,
  onChange,
  onAdd,
  onRemove,
  setShowAddCategory,
  setPendingFieldIdForNewCategory,
  setShowAddAccount,
  setPendingFieldIdForNewAccount,
  getAccentColor,
}) => {
  return (
    <div style={{ 
      display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr auto auto', gap: 10, alignItems: 'center',
      marginBottom: 15, padding: 15, backgroundColor: '#fff', border: `2px solid ${getAccentColor()}`, borderRadius: 8
    }}>
      <div>
        <label style={{ display: 'block', marginBottom: 5, fontSize: 14, fontWeight: 500 }}>Amount</label>
        <input type="number" value={value.amount || ''} 
          onChange={(e) => onChange(value.id, { amount: parseFloat(e.target.value) || 0 })}
          placeholder="0.00" style={{ width: '100%', padding: '8px 12px', border: '1px solid #ced4da', borderRadius: 4, fontSize: 14 }} />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: 5, fontSize: 14, fontWeight: 500 }}>Account</label>
        <select
          value={value.account || accounts[0] || ''}
          onChange={(e) => {
            const val = e.target.value;
            if (val === NEW_ACCOUNT_OPTION) {
              setShowAddAccount(true);
              setPendingFieldIdForNewAccount(value.id);
              return;
            }
            onChange(value.id, { account: val });
          }}
          style={{ width: '100%', padding: '8px 12px', border: '1px solid #ced4da', borderRadius: 4, fontSize: 14 }}
        >
          {accounts.map((acct) => (
            <option key={acct} value={acct}>{acct}</option>
          ))}
          <option value={NEW_ACCOUNT_OPTION}>+ New account…</option>
        </select>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: 5, fontSize: 14, fontWeight: 500 }}>Category</label>
        <select
          value={value.category || ''}
          onChange={(e) => {
            const val = e.target.value;
            if (val === NEW_CATEGORY_OPTION) {
              setShowAddCategory(true);
              setPendingFieldIdForNewCategory(value.id);
              return;
            }
            onChange(value.id, { category: val });
          }}
          style={{ width: '100%', padding: '8px 12px', border: '1px solid #ced4da', borderRadius: 4, fontSize: 14 }}
        >
          <option value="">Select Category</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
          <option value={NEW_CATEGORY_OPTION}>+ New category…</option>
        </select>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: 5, fontSize: 14, fontWeight: 500 }}>Description</label>
        <input type="text" value={value.description}
          onChange={(e) => onChange(value.id, { description: e.target.value })}
          placeholder="Description" style={{ width: '100%', padding: '8px 12px', border: '1px solid #ced4da', borderRadius: 4, fontSize: 14 }} />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: 5, fontSize: 14, fontWeight: 500 }}>Date</label>
        <input type="date" value={value.date}
          onChange={(e) => onChange(value.id, { date: e.target.value })}
          style={{ width: '100%', padding: '8px 12px', border: '1px solid #ced4da', borderRadius: 4, fontSize: 14 }} />
      </div>

      <button onClick={onAdd} style={{ background: getAccentColor(), color: 'white', border: 'none', borderRadius: 4, padding: '8px 12px', cursor: 'pointer', fontSize: 16, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Add new expense field">+</button>
      <button onClick={() => onRemove(value.id)} style={{ background: getAccentColor(), color: 'white', border: 'none', borderRadius: 4, padding: '8px 12px', cursor: 'pointer', fontSize: 16, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Remove expense field">−</button>
    </div>
  );
};

export default ExpenseRow;

