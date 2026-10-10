import React, { useState } from 'react';
import { StitchFrameSpec } from '../types';
import { X, Copy, Check, Download, Layers, FileCode } from 'lucide-react';

interface StitchExportModalProps {
  frames: StitchFrameSpec[];
  onClose: () => void;
}

export const StitchExportModal: React.FC<StitchExportModalProps> = ({
  frames,
  onClose,
}) => {
  const [copiedAll, setCopiedAll] = useState(false);
  const [selectedFrameId, setSelectedFrameId] = useState(frames[0].id);

  const selectedFrame = frames.find((f) => f.id === selectedFrameId) || frames[0];

  const allFramesExport = frames
    .map(
      (f) =>
        `### ${f.frameCode}: ${f.name}\n**Viewport**: ${f.desktopDimensions} (Mobile: ${f.mobileDimensions})\n\n\`\`\`\n${f.stitchPrompt}\n\`\`\`\n`
    )
    .join('\n---\n\n');

  const handleCopyAll = () => {
    navigator.clipboard.writeText(allFramesExport);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="text-base font-bold text-[var(--ag-text)]">Export Google Stitch Prompts</h3>
              <p className="text-xs text-[var(--ag-muted)]">Ready-to-paste design system prompts for Google AI Studio & Stitch Canvas.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[var(--ag-muted)] hover:text-[var(--ag-text)] rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--ag-muted)]">Select Frame to Inspect / Copy:</span>
            <button
              onClick={handleCopyAll}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-[var(--ag-text)] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              {copiedAll ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>All 7 Frames Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy All 7 Frames Bundle</span>
                </>
              )}
            </button>
          </div>

          {/* Frame Pills */}
          <div className="flex flex-wrap gap-1.5">
            {frames.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFrameId(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium font-mono transition-colors ${
                  selectedFrameId === f.id
                    ? 'bg-blue-600 text-[var(--ag-text)]'
                    : 'bg-slate-800 text-[var(--ag-muted)] hover:text-[var(--ag-text)] border border-slate-700'
                }`}
              >
                {f.frameCode}
              </button>
            ))}
          </div>

          {/* Prompt Code Container */}
          <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
            <div className="px-3.5 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-[var(--ag-muted)]">
              <span className="text-[var(--ag-text)] font-semibold">{selectedFrame.name}</span>
              <span>{selectedFrame.desktopDimensions}</span>
            </div>
            <pre className="p-4 text-xs font-mono text-blue-300 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
              {selectedFrame.stitchPrompt}
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between text-xs text-[var(--ag-muted)] font-mono">
          <span>Formatted for Google AI Studio & Stitch Design Prompts</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-[var(--ag-text)] rounded-lg font-sans font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
