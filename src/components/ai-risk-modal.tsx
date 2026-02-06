'use client';

interface AIRiskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExplainMore: () => void;
  onContinue?: () => void;
  alertMessage?: string;
  riskLevel?: string;
  signals?: string[];
  metrics?: {
    volumeRatio?: number;
    rangePercent?: number;
    priceChangePercent?: number;
    trades?: number;
  };
  isStreaming?: boolean;
}

const formatMetric = (value?: number, suffix: string = '') => {
  if (value === undefined || value === null || Number.isNaN(value)) return '--';
  return `${value.toFixed(2)}${suffix}`;
};

export const AIRiskModal = ({
  isOpen,
  onClose,
  onExplainMore,
  onContinue,
  alertMessage = '',
  riskLevel = 'high',
  signals = [],
  metrics,
  isStreaming = false
}: AIRiskModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-lg rounded-xl bg-[#1d2631] p-8 shadow-2xl border-t-4 ${riskLevel === 'HIGH_RISK' || riskLevel === 'high' ? 'border-[#ff5c5c]' : 'border-[#f0b90b]'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-start gap-4">
          <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${riskLevel === 'HIGH_RISK' || riskLevel === 'high' ? 'bg-[#ff5c5c]/20' : 'bg-[#f0b90b]/20'}`}>
            <svg className={`h-6 w-6 ${riskLevel === 'HIGH_RISK' || riskLevel === 'high' ? 'text-[#ff5c5c]' : 'text-[#f0b90b]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">Market Guardian Alert</h3>
            <p className="text-sm text-[#9aa7b2]">AI-powered risk detection: <span className="font-mono font-bold">{riskLevel.toUpperCase()}</span></p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="text-[#e6edf3] leading-relaxed min-h-[3.5em] text-lg font-medium">
            {alertMessage && alertMessage !== 'Risk detected...' ? alertMessage : (
              <span className="text-[#9aa7b2] italic animate-pulse">Analyzing market conditions...</span>
            )}
            {isStreaming && (
              <span className="inline-block w-2 H-4 ml-1 bg-[#4ea1ff] animate-[blink_1s_step-end_infinite]" />
            )}
          </div>

          {signals.length > 0 && (
            <div className="rounded-lg border border-[#283341] bg-[#141b23] p-3">
              <div className="text-xs uppercase tracking-wider text-[#9aa7b2] mb-2">Signals</div>
              <div className="flex flex-wrap gap-2">
                {signals.map((signal, idx) => (
                  <span key={`${signal}-${idx}`} className="rounded-full bg-[#283341] px-2.5 py-1 text-xs text-[#e6edf3]">
                    {signal}
                  </span>
                ))}
              </div>
            </div>
          )}

          {metrics && (
            <div className="grid grid-cols-2 gap-3 rounded-lg border border-[#283341] bg-[#141b23] p-3 text-sm">
              <div className="flex flex-col">
                <span className="text-xs text-[#9aa7b2]">Volume Ratio</span>
                <span className="text-white">{formatMetric(metrics.volumeRatio, 'x')}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-[#9aa7b2]">Range %</span>
                <span className="text-white">{formatMetric(metrics.rangePercent, '%')}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-[#9aa7b2]">24h Change</span>
                <span className="text-white">{formatMetric(metrics.priceChangePercent, '%')}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-[#9aa7b2]">Trades</span>
                <span className="text-white">{metrics.trades ?? '--'}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onExplainMore}
            className="flex-1 rounded-lg bg-[#4ea1ff] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#3b82f6] shadow-lg shadow-blue-900/20"
          >
            Full Analysis
          </button>
          {onContinue ? (
            <button
              onClick={onContinue}
              className="flex-1 rounded-lg border border-[#283341] bg-[#141b23] px-6 py-3 font-semibold text-[#9aa7b2] transition-colors hover:text-white hover:bg-[#283341]"
            >
              Continue Anyway
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-[#283341] bg-[#141b23] px-6 py-3 font-semibold text-[#9aa7b2] transition-colors hover:text-white hover:bg-[#283341]"
            >
              Dismiss
            </button>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-[#54616e]">
          This is not financial advice. Just market context.
        </p>
      </div>
    </div>
  );
};
