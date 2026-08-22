'use client';

import { useState, useMemo } from 'react';
import { Transaction } from '../../lib/api';

type SortKey = 'date' | 'type' | 'amount' | 'status';
type SortDirection = 'asc' | 'desc';

interface TransactionTableProps {
  transactions: Transaction[];
}

export default function TransactionTable({ transactions }: TransactionTableProps) {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection } | null>(null);

  // Handle sorting logic when a header is clicked
  const requestSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter and Sort the data efficiently
  const processedTransactions = useMemo(() => {
    let result = transactions.filter((txn) => 
      statusFilter === 'ALL' ? true : txn.status === statusFilter
    );

    if (sortConfig !== null) {
      result.sort((a, b) => {
        // Special handling to parse currency strings (e.g., "-$4,230.50" -> -4230.50)
        if (sortConfig.key === 'amount') {
          const valA = parseFloat(a.amount.replace(/[$,+]/g, ''));
          const valB = parseFloat(b.amount.replace(/[$,+]/g, ''));
          return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
        }

        // Standard string comparison for date, type, and status
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return result;
  }, [transactions, statusFilter, sortConfig]);

  return (
    <div className="glass-panel overflow-hidden h-full flex flex-col">
      <div className="p-6 border-b border-white/10 flex justify-between items-center flex-wrap gap-4">
        <h3 className="text-xl font-bold text-on-surface tracking-wide">Neural Ledger</h3>
        
        <div className="flex items-center gap-4">
          {/* Status Filter Dropdown */}
          <select 
            className="bg-surface-container border border-outline-variant text-on-surface text-sm rounded px-3 py-1.5 focus:outline-none focus:border-primary transition-colors"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="COMPLETED">Completed</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-highest/50">
              <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-widest border-b border-white/10">ID</th>
              
              {/* Clickable Headers for Sorting */}
              {[
                { key: 'date', label: 'Date' },
                { key: 'type', label: 'Operation' },
                { key: 'amount', label: 'Amount' },
                { key: 'status', label: 'Status' }
              ].map(({ key, label }) => (
                <th 
                  key={key}
                  onClick={() => requestSort(key as SortKey)}
                  className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-widest border-b border-white/10 cursor-pointer hover:text-primary transition-colors select-none"
                >
                  <div className="flex items-center gap-1">
                    {label}
                    {sortConfig?.key === key && (
                      <span className="text-primary">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm">
            {processedTransactions.length > 0 ? (
              processedTransactions.map((txn) => (
                <tr key={txn.id} className="border-b border-white/5 hover:bg-surface-container/40 transition-colors">
                  <td className="p-4 text-on-surface-variant font-mono">{txn.id}</td>
                  <td className="p-4 text-on-surface">{txn.date}</td>
                  <td className="p-4 text-on-surface font-medium">{txn.type}</td>
                  <td className={`p-4 font-bold ${txn.amount.startsWith('+') ? 'text-[#00ff9d]' : 'text-on-surface'}`}>
                    {txn.amount}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold tracking-wider ${
                      txn.status === 'COMPLETED' 
                        ? 'bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/20'
                        : txn.status === 'PENDING'
                        ? 'bg-secondary-container text-primary-fixed border border-primary/20'
                        : 'bg-error-container text-on-error-container border border-error/20'
                    }`}>
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-on-surface-variant italic">
                  No transactions found for the selected filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}