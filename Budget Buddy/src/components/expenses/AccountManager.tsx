import React from 'react';
import { NEW_ACCOUNT_OPTION } from './constants';

interface Props {
  accounts: string[];
  selectedAccount: string;
  setSelectedAccount: (val: string) => void;
  showAddAccount: boolean;
  setShowAddAccount: (show: boolean) => void;
  newAccount: string;
  setNewAccount: (val: string) => void;
  addNewAccount: () => void;
  removeAccount: (name: string) => void;
  canRemove: (name: string) => boolean;
  getAccentColor: () => string;
}

const AccountManager: React.FC<Props> = ({
  accounts,
  selectedAccount,
  setSelectedAccount,
  showAddAccount,
  setShowAddAccount,
  newAccount,
  setNewAccount,
  addNewAccount,
  removeAccount,
  canRemove,
  getAccentColor,
}) => {
  return (
    <div style={{ 
      marginBottom: '20px', padding: '15px', backgroundColor: '#fff', borderRadius: 8,
      border: `1px solid ${getAccentColor()}`
    }}>
      <h3 style={{ marginBottom: 10, fontSize: 16, color: getAccentColor() }}>Manage Accounts</h3>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <select
          value={selectedAccount || ''}
          onChange={(e) => {
            const value = e.target.value;
            if (value === NEW_ACCOUNT_OPTION) {
              setShowAddAccount(true);
              return;
            }
            setSelectedAccount(value);
          }}
          style={{ padding: '8px 12px', border: '1px solid #ced4da', borderRadius: 4, fontSize: 14, minWidth: 220 }}
        >
          {accounts.map((acct) => (
            <option key={acct} value={acct}>{acct}</option>
          ))}
          <option value={NEW_ACCOUNT_OPTION}>+ New account…</option>
        </select>
        <button
          onClick={() => removeAccount(selectedAccount)}
          disabled={!selectedAccount || !canRemove(selectedAccount)}
          style={{
            background: (!selectedAccount || !canRemove(selectedAccount)) ? '#6c757d' : '#dc3545',
            color: 'white', border: 'none', borderRadius: 4, padding: '8px 12px', cursor: (!selectedAccount || !canRemove(selectedAccount)) ? 'not-allowed' : 'pointer', fontSize: 14
          }}
        >
          − Remove
        </button>
        {showAddAccount ? (
          <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            <input
              type="text"
              value={newAccount}
              onChange={(e) => setNewAccount(e.target.value)}
              placeholder="New account name"
              style={{ padding: '8px 12px', border: '1px solid #ced4da', borderRadius: 4, fontSize: 14 }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') addNewAccount();
                if (e.key === 'Escape') setShowAddAccount(false);
              }}
            />
            <button
              onClick={addNewAccount}
              style={{ background: getAccentColor(), color: 'white', border: 'none', borderRadius: 4, padding: '8px 12px', cursor: 'pointer', fontSize: 14 }}
            >
              + Add
            </button>
            <button
              onClick={() => setShowAddAccount(false)}
              style={{ background: '#6c757d', color: 'white', border: 'none', borderRadius: 4, padding: '8px 12px', cursor: 'pointer', fontSize: 14 }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAddAccount(true)}
            style={{ background: getAccentColor(), color: 'white', border: 'none', borderRadius: 4, padding: '8px 12px', cursor: 'pointer', fontSize: 14 }}
          >
            + New Account
          </button>
        )}
      </div>
    </div>
  );
};

export default AccountManager;

