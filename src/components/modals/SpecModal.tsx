import React, { useState } from 'react';
import { X, Copy, Check, FileCode, Database, Layers, Sparkles } from 'lucide-react';
import { OnePagerSpecView } from '../OnePagerSpecView';
import { DatabaseSchemaView } from '../DatabaseSchemaView';
import { motion } from 'motion/react';

interface SpecModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpecModal: React.FC<SpecModalProps> = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState<'spec' | 'database'>('spec');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[var(--ag-bg)]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel border-[var(--ag-border)] rounded-3xl max-w-6xl w-full h-[90vh] flex flex-col shadow-2xl bg-[#060a14]/95 overflow-hidden"
      >
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-[var(--ag-border)] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--ag-surface)] border border-[var(--ag-border)] flex items-center justify-center text-[var(--ag-text)] font-mono text-xs font-bold">
              //
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--ag-text)]">DevConnect AI Architecture & Schema</h2>
              <p className="text-xs text-[var(--ag-muted)]">One-pager specification, PostgreSQL 15 DDL with RLS, and Stitch prompts.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 rounded-xl glass-panel">
              <button
                onClick={() => setTab('spec')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  tab === 'spec'
                    ? 'bg-[var(--ag-card)] text-[var(--ag-text)] font-semibold'
                    : 'text-[var(--ag-muted)] hover:text-[var(--ag-text)]'
                }`}
              >
                One-Pager Spec
              </button>
              <button
                onClick={() => setTab('database')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  tab === 'database'
                    ? 'bg-[var(--ag-card)] text-[var(--ag-text)] font-semibold'
                    : 'text-[var(--ag-muted)] hover:text-[var(--ag-text)]'
                }`}
              >
                PostgreSQL & RLS
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[var(--ag-muted)] hover:text-[var(--ag-text)] hover:bg-[var(--ag-surface)]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto">
          {tab === 'spec' ? <OnePagerSpecView /> : <DatabaseSchemaView />}
        </div>
      </motion.div>
    </div>
  );
};
