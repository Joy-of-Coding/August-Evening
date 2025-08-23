import React from "react";
import { NEW_ACCOUNT_OPTION, NEW_CATEGORY_OPTION } from "../expenses/constants";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
    className="grid grid-cols-[1.1fr_1fr_1fr_2fr_1fr_auto_auto] gap-3 items-center p-3 
               rounded-2xl shadow-md 
               bg-gradient-to-r from-indigo-700 via-indigo-800 to-blue-900 
               border border-slate-600"
  >
    {/* Date */}
    <Input
      type="date"
      value={value.date || new Date().toISOString().split("T")[0]}
      onChange={(e) => {
        const newDate = e.target.value;
        if (newDate) onChange(value.id, { date: newDate });
      }}
      min="1900-01-01"
      max="2100-12-31"
      className="text-teal-200 bg-slate-800/70 border-slate-600 focus:border-teal-400 focus:ring-teal-400"
    />

    {/* Account */}
    <Select
      value={value.account || accounts[0] || ""}
      onValueChange={(v) => {
        if (v === NEW_ACCOUNT_OPTION) return onNewAccountRequested(value.id);
        onChange(value.id, { account: v });
      }}
    >
      <SelectTrigger className="text-teal-200 border-slate-600 bg-slate-800/70 focus:border-teal-400">
        <SelectValue placeholder={accounts.length === 0 ? "No accounts — add new…" : "Select account"} />
      </SelectTrigger>
      <SelectContent className="bg-slate-800 border-slate-600 text-slate-100">
        {accounts.map((a) => (
          <SelectItem key={a} value={a}>
            {a}
          </SelectItem>
        ))}
        <SelectItem value={NEW_ACCOUNT_OPTION}>+ New account…</SelectItem>
      </SelectContent>
    </Select>

    {/* Category */}
    <Select
      value={value.category || categories[0] || ""}
      onValueChange={(v) => {
        if (v === NEW_CATEGORY_OPTION) return onNewCategoryRequested(value.id);
        onChange(value.id, { category: v });
      }}
    >
      <SelectTrigger className="text-teal-200 border-slate-600 bg-slate-800/70 focus:border-teal-400">
        <SelectValue placeholder="Select category" />
      </SelectTrigger>
      <SelectContent className="bg-slate-800 border-slate-600 text-slate-100">
        {categories.map((c) => (
          <SelectItem key={c} value={c}>
            {c}
          </SelectItem>
        ))}
        <SelectItem value={NEW_CATEGORY_OPTION}>+ New category…</SelectItem>
      </SelectContent>
    </Select>

    {/* Payee / Income Source */}
    <div>
      <Input
        type="text"
        placeholder={isIncome ? "Income Source" : "Payee"}
        value={value.payee}
        onChange={(e) => onChange(value.id, { payee: e.target.value })}
        list={`payees-${value.id}`}
        className="text-teal-200 border-slate-600 bg-slate-800/70 placeholder-slate-400 focus:border-teal-400"
      />
      <datalist id={`payees-${value.id}`}>
        {payeeSuggestions.map((p) => (
          <option key={p} value={p} />
        ))}
      </datalist>
    </div>

    {/* Amount */}
    <Input
      type="text"
      placeholder="0.00"
      value={
        typeof value.amount === "string"
          ? value.amount
          : value.amount === 0
          ? ""
          : value.amount.toFixed(2)
      }
      onChange={(e) => {
        const val = e.target.value;
        if (val === "" || /^\d*\.?\d{0,2}$/.test(val)) {
          onChange(value.id, { amount: val === "" ? "" : val });
        }
      }}
      onBlur={(e) => {
        const val = e.target.value;
        if (val === "" || val === "0") {
          onChange(value.id, { amount: 0 });
        } else {
          const num = parseFloat(val);
          onChange(value.id, { amount: !isNaN(num) ? parseFloat(num.toFixed(2)) : 0 });
        }
      }}
      className="text-slate-100 border-slate-600 bg-slate-800/70 focus:border-teal-400"
    />

    {/* Line balance */}
    <div className="text-right font-semibold text-teal-300">
      ${lineBalance.toFixed(2)}
    </div>

    {/* Action buttons */}
    <div className="flex gap-2">
      {(() => {
        const amountValue =
          typeof value?.amount === "string" && value.amount !== ""
            ? parseFloat(value.amount)
            : Number(value?.amount) || 0;
        const isComplete =
          Boolean(
            value?.date &&
              value?.account &&
              value?.category &&
              (value?.payee?.trim()?.length ?? 0) > 0 &&
              amountValue > 0
          );

        return (
          <Button
            onClick={() => onAdd(value.id)}
            disabled={!isComplete}
            className={`w-9 h-9 rounded-full font-bold ${
              isComplete
                ? "bg-indigo-500 hover:bg-indigo-600 text-white"
                : "bg-slate-600 text-slate-400 cursor-not-allowed"
            }`}
            title={
              isComplete
                ? isIncome
                  ? "Add income"
                  : "Add transaction"
                : isIncome
                ? "Fill date, account, category, income source, and amount to add"
                : "Fill date, account, category, payee, and amount to add"
            }
          >
            +
          </Button>
        );
      })()}

      <Button
        onClick={() => onRemove(value.id)}
        className="w-9 h-9 rounded-full font-bold bg-red-600 hover:bg-red-700 text-white"
        title="Remove transaction"
      >
        −
      </Button>
    </div>
  </div>
);
}

export default TransactionRow;


