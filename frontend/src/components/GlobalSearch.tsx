'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Bot, FileText, Search, Users } from 'lucide-react';
import { agentRecords } from '../data/agents';
import { useAllCustomers, useApplications } from '../state/demoStore';

interface SearchResult {
  id: string;
  label: string;
  meta: string;
  href: string;
  icon: typeof Users;
}

export function GlobalSearch({ onNavigate }: { onNavigate?: () => void }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const customers = useAllCustomers();
  const applications = useApplications();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setOpen(false);
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];

    const customerResults: SearchResult[] = customers
      .filter((customer) => customer.name.toLowerCase().includes(q) || customer.id.toLowerCase().includes(q))
      .slice(0, 4)
      .map((customer) => ({ id: customer.id, label: customer.name, meta: `Customer · ${customer.id}`, href: `/customers/${customer.id}`, icon: Users }));

    const applicationResults: SearchResult[] = applications
      .filter((application) => application.customerName.toLowerCase().includes(q) || application.id.toLowerCase().includes(q))
      .slice(0, 3)
      .map((application) => ({ id: application.id, label: application.customerName, meta: `Application · ${application.id}`, href: `/onboarding/${application.id}`, icon: FileText }));

    const agentResults: SearchResult[] = agentRecords
      .filter((agent) => agent.name.toLowerCase().includes(q))
      .slice(0, 3)
      .map((agent) => ({ id: agent.id, label: agent.name, meta: 'AI agent', href: '/agents', icon: Bot }));

    return [...customerResults, ...applicationResults, ...agentResults].slice(0, 8);
  }, [query, customers, applications]);

  return (
    <div className="bank-search-wrap" ref={containerRef}>
      <label className="bank-search">
        <Search size={16} />
        <span className="sr-only">Search customers, applications, agents</span>
        <input
          placeholder="Search customers, applications, agents..."
          value={query}
          onChange={(event) => { setQuery(event.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
        />
      </label>
      {open && query.trim().length >= 2 && (
        <div className="global-search-panel">
          {results.length === 0 ? (
            <div className="global-search-empty"><Search size={14} />No matches for &quot;{query}&quot;</div>
          ) : (
            results.map((result) => (
              <Link
                href={result.href}
                key={`${result.href}-${result.id}`}
                className="global-search-row"
                onClick={() => { setOpen(false); setQuery(''); onNavigate?.(); }}
              >
                <result.icon size={14} />
                <div><strong>{result.label}</strong><small>{result.meta}</small></div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
