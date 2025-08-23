import React from "react";
import { NEW_ACCOUNT_OPTION, NEW_CATEGORY_OPTION } from "../expenses/constants";

export interface Transaction {
  id: string;
  date: string;
  account: string;
  category: string;
  payee: string;
  amount: number | string; // positive = withdrawal, negative = deposit. String (including "") allowed during typing.
  type?: 'expense' | 'income'; // 'expense' is default, 'income' for money coming in
}

interface Props {
  value: Transaction;
  categories: string[];
  accounts: string[];
  payeeSuggestions: string[];
  onChange: (id: string, patch: Partial<Transaction>) => void;
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  onNewCategoryRequested: (id: string) => void;
  onNewAccountRequested: (id: string) => void;
  lineBalance: number; // balance after this transaction
  isIncome?: boolean; // true for income transactions
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "2px 6px",
  border: "1px solid #ced4da",
  borderRadius: 4,
  fontSize: 14,
  boxShadow: "0 4px 8px rgba(0, 0, 0, .6)",
};

const TransactionRow: React.FC<Props> = ({
  value,
  categories,
  accounts,
  onChange,
  onAdd,
  onRemove,
  onNewCategoryRequested,
  onNewAccountRequested,
  lineBalance,
  payeeSuggestions,
  isIncome = false,
}) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1.1fr 1fr 1fr 2fr 1fr auto auto",
        gap: 5,
        alignItems: "center",
        padding: 1,
        
        borderRadius: 8,
        
      }}
    >
      <input
        type="date"
        value={value.date || new Date().toISOString().split('T')[0]}
        onChange={(e) => {
          const newDate = e.target.value;
          if (newDate) {
            onChange(value.id, { date: newDate });
          }
        }}
        style={{
          ...inputStyle,
          color: '#000000',
          backgroundColor: '#ffffff'
        }}
        min="1900-01-01"
        max="2100-12-31"
      />

      <select
        value={value.account || accounts[0] || ''}
        onChange={(e) => {
          const v = e.target.value;
          if (v === NEW_ACCOUNT_OPTION) return onNewAccountRequested(value.id);
          onChange(value.id, { account: v });
        }}
        style={{
          ...inputStyle,
          color: '#000000',
          backgroundColor: '#ffffff'
        }}
      >
        <option value="">{accounts.length === 0 ? 'No accounts — add new…' : 'Select account'}</option>
        {accounts.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
        <option value={NEW_ACCOUNT_OPTION}>+ New account…</option>
      </select>

      <select
        value={value.category || categories[0] || ''}
        onChange={(e) => {
          const v = e.target.value;
          if (v === NEW_CATEGORY_OPTION) return onNewCategoryRequested(value.id);
          onChange(value.id, { category: v });
        }}
        style={{
          ...inputStyle,
          color: '#000000',
          backgroundColor: '#ffffff'
        }}
      >
        <option value="">Select category</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
        <option value={NEW_CATEGORY_OPTION}>+ New category…</option>
      </select>

      <>
        <input
          type="text"
          placeholder={isIncome ? "Income Source" : "Payee"}
          value={value.payee}
          onChange={(e) => onChange(value.id, { payee: e.target.value })}
          list={`payees-${value.id}`}
          style={{
            ...inputStyle,
            color: '#000000',
            backgroundColor: '#ffffff'
          }}
        />
        <datalist id={`payees-${value.id}`}>
          {payeeSuggestions.map((p) => (
            <option key={p} value={p} />
          ))}
        </datalist>
      </>

                           <input
          type="text"
          placeholder="0.00"
          value={
            typeof value.amount === 'string' ? value.amount : 
            (value.amount === 0 ? "" : value.amount.toFixed(2))
          }
          onChange={(e) => {
            const val = e.target.value;
            // Allow empty, partial numbers, and valid decimal format
            if (val === "" || /^\d*\.?\d{0,2}$/.test(val)) {
              if (val === "") {
                onChange(value.id, { amount: "" });
              } else {
                // Always store as string while typing to preserve decimal point
                onChange(value.id, { amount: val });
              }
            }
          }}
          onBlur={(e) => {
            // Format to 2 decimal places when field loses focus
            const val = e.target.value;
            if (val === "" || val === "0") {
              onChange(value.id, { amount: 0 });
            } else {
              const num = parseFloat(val);
              if (!isNaN(num)) {
                onChange(value.id, { amount: parseFloat(num.toFixed(2)) });
              } else {
                onChange(value.id, { amount: 0 });
              }
            }
          }}
          style={{
            ...inputStyle,
            color: '#000000',
            backgroundColor: '#ffffff'
          }}
        />

      <div style={{ textAlign: "right", fontWeight: 600 }}>${lineBalance.toFixed(2)}</div>

      <div style={{ display: "flex", gap: 6 }}>
                                   {(() => {
            const amountValue = typeof value?.amount === 'string' && value.amount !== "" ? parseFloat(value.amount) : Number(value?.amount) || 0;
            const isComplete = Boolean(
              value?.date && value?.account && value?.category && (value?.payee?.trim()?.length ?? 0) > 0 && amountValue > 0
            );
           return (
             <button
               onClick={() => onAdd(value.id)}
               title={isComplete ? (isIncome ? "Add income" : "Add transaction") : (isIncome ? "Fill date, account, category, income source, and amount to add" : "Fill date, account, category, payee, and amount to add")}
               disabled={!isComplete}
               aria-disabled={!isComplete}
               style={{
                 background: isComplete ? "#16a34a" : "#9CA3AF",
                 color: "#fff",
                 border: "none",
                 borderRadius: 6,
                 width: 36,
                 height: 36,
                 cursor: isComplete ? "pointer" : "not-allowed",
               }}
             >
               +
             </button>
           );
         })()}
        <button
          onClick={() => onRemove(value.id)}
          title="Remove transaction"
          style={{ background: "#dc2626", color: "#fff", border: "none", borderRadius: 6, width: 36, height: 36 }}
        >
          −
        </button>
      </div>
    </div>
  );
};

export default TransactionRow;


