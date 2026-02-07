'use client';

import { FullAnalysisResponse } from '../services/api';

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
    priceChange24h?: number;
    trades?: number;
    [key: string]: any;
  };
  isStreaming?: boolean;
  isLoadingAnalysis?: boolean;
  fullAnalysis?: FullAnalysisResponse | null;
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
  isStreaming = false,
  isLoadingAnalysis = false,
  fullAnalysis
}: AIRiskModalProps) => {
  if (!isOpen) return null;

  const hasFullAnalysis = !!fullAnalysis;

  const isHighRisk = riskLevel === 'HIGH_RISK' || riskLevel === 'CRITICAL_RISK' || riskLevel === 'high';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className={`relative w-full rounded-xl bg-[#1d2631] shadow-2xl border-t-4 flex flex-col transition-all duration-300 ${
          hasFullAnalysis ? 'max-w-4xl max-h-[90vh]' : 'max-w-lg'
        } ${isHighRisk ? 'border-[#ff5c5c]' : 'border-[#f0b90b]'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed */}
        <div className="p-6 pb-4 border-b border-[#283341]">
          <div className="flex items-start gap-4">
            <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${isHighRisk ? 'bg-[#ff5c5c]/20' : 'bg-[#f0b90b]/20'}`}>
              <svg className={`h-6 w-6 ${isHighRisk ? 'text-[#ff5c5c]' : 'text-[#f0b90b]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-1">Market Guardian Alert</h3>
              <p className="text-sm text-[#9aa7b2]">AI-powered risk detection: <span className={`font-mono font-bold ${isHighRisk ? 'text-[#ff5c5c]' : 'text-[#f0b90b]'}`}>{riskLevel.toUpperCase().replace('_', ' ')}</span></p>
            </div>
            {/* Close button */}
            <button onClick={onClose} className="text-[#9aa7b2] hover:text-white transition-colors">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Summary */}
          <div className="text-[#e6edf3] leading-relaxed text-base">
            {alertMessage && alertMessage !== 'Risk detected...' ? alertMessage : (
              <span className="text-[#9aa7b2] italic animate-pulse">Analyzing market conditions...</span>
            )}
            {isStreaming && (
              <span className="inline-block w-2 h-4 ml-1 bg-[#4ea1ff] animate-[blink_1s_step-end_infinite]" />
            )}
          </div>

          {/* Signals */}
          {signals.length > 0 && (
            <div className="rounded-lg border border-[#283341] bg-[#141b23] p-4">
              <div className="text-xs uppercase tracking-wider text-[#9aa7b2] mb-3">Signals</div>
              <div className="flex flex-wrap gap-2">
                {signals.map((signal, idx) => (
                  <span key={`${signal}-${idx}`} className="rounded-full bg-[#283341] px-3 py-1.5 text-sm text-[#e6edf3]">
                    {signal}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Metrics Grid */}
          {metrics && (
            <div className={`grid gap-3 rounded-lg border border-[#283341] bg-[#141b23] p-4 text-sm ${hasFullAnalysis ? 'grid-cols-4' : 'grid-cols-2'}`}>
              <div className="flex flex-col">
                <span className="text-xs text-[#9aa7b2]">Volume Ratio</span>
                <span className="text-white text-lg font-semibold">{formatMetric(metrics.volumeRatio, 'x')}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-[#9aa7b2]">Range %</span>
                <span className="text-white text-lg font-semibold">{formatMetric(metrics.rangePercent, '%')}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-[#9aa7b2]">24h Change</span>
                <span className={`text-lg font-semibold ${(metrics.priceChange24h ?? metrics.priceChangePercent ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatMetric(metrics.priceChange24h ?? metrics.priceChangePercent, '%')}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-[#9aa7b2]">Trades</span>
                <span className="text-white text-lg font-semibold">{metrics.trades ?? '--'}</span>
              </div>
            </div>
          )}

          {/* Full Analysis Sections */}
          {hasFullAnalysis && fullAnalysis && (
            <>
              {/* Trends */}
              {fullAnalysis.trends && (
                <div className="rounded-lg border border-[#283341] bg-[#141b23] p-4">
                  <div className="text-xs uppercase tracking-wider text-[#9aa7b2] mb-3">Market Trends</div>
                  <div className="grid grid-cols-3 gap-4">
                    {fullAnalysis.trends.shortTerm && (
                      <div className="flex flex-col">
                        <span className="text-xs text-[#9aa7b2] mb-1">Short Term</span>
                        <span className={`text-sm font-medium ${fullAnalysis.trends.shortTerm.toLowerCase().includes('bull') ? 'text-green-400' : fullAnalysis.trends.shortTerm.toLowerCase().includes('bear') ? 'text-red-400' : 'text-[#e6edf3]'}`}>
                          {fullAnalysis.trends.shortTerm}
                        </span>
                      </div>
                    )}
                    {fullAnalysis.trends.mediumTerm && (
                      <div className="flex flex-col">
                        <span className="text-xs text-[#9aa7b2] mb-1">Medium Term</span>
                        <span className={`text-sm font-medium ${fullAnalysis.trends.mediumTerm.toLowerCase().includes('bull') ? 'text-green-400' : fullAnalysis.trends.mediumTerm.toLowerCase().includes('bear') ? 'text-red-400' : 'text-[#e6edf3]'}`}>
                          {fullAnalysis.trends.mediumTerm}
                        </span>
                      </div>
                    )}
                    {fullAnalysis.trends.longTerm && (
                      <div className="flex flex-col">
                        <span className="text-xs text-[#9aa7b2] mb-1">Long Term</span>
                        <span className={`text-sm font-medium ${fullAnalysis.trends.longTerm.toLowerCase().includes('bull') ? 'text-green-400' : fullAnalysis.trends.longTerm.toLowerCase().includes('bear') ? 'text-red-400' : 'text-[#e6edf3]'}`}>
                          {fullAnalysis.trends.longTerm}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Support & Resistance */}
              {fullAnalysis.supportResistance && (fullAnalysis.supportResistance.support?.length || fullAnalysis.supportResistance.resistance?.length) && (
                <div className="rounded-lg border border-[#283341] bg-[#141b23] p-4">
                  <div className="text-xs uppercase tracking-wider text-[#9aa7b2] mb-3">Support & Resistance Levels</div>
                  <div className="grid grid-cols-2 gap-4">
                    {fullAnalysis.supportResistance.support && fullAnalysis.supportResistance.support.length > 0 && (
                      <div>
                        <span className="text-xs text-green-400 mb-2 block">Support</span>
                        <div className="flex flex-wrap gap-2">
                          {fullAnalysis.supportResistance.support.map((level, idx) => (
                            <span key={`support-${idx}`} className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-sm font-mono">
                              ${level.toLocaleString()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {fullAnalysis.supportResistance.resistance && fullAnalysis.supportResistance.resistance.length > 0 && (
                      <div>
                        <span className="text-xs text-red-400 mb-2 block">Resistance</span>
                        <div className="flex flex-wrap gap-2">
                          {fullAnalysis.supportResistance.resistance.map((level, idx) => (
                            <span key={`resistance-${idx}`} className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-sm font-mono">
                              ${level.toLocaleString()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Recommendation */}
              {fullAnalysis.recommendation && (
                <div className="rounded-lg border border-[#4ea1ff]/30 bg-[#4ea1ff]/10 p-4">
                  <div className="text-xs uppercase tracking-wider text-[#4ea1ff] mb-2">AI Recommendation</div>
                  <p className="text-[#e6edf3] leading-relaxed">{fullAnalysis.recommendation}</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer - Fixed */}
        <div className="p-6 pt-4 border-t border-[#283341] flex gap-3">
          {!hasFullAnalysis ? (
            <button
              onClick={onExplainMore}
              disabled={isLoadingAnalysis}
              className="flex-1 rounded-lg bg-[#4ea1ff] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#3b82f6] shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingAnalysis ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analyzing...
                </span>
              ) : (
                'Full Analysis'
              )}
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex-1 rounded-lg bg-[#4ea1ff] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#3b82f6] shadow-lg shadow-blue-900/20"
            >
              Got It
            </button>
          )}
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

        <p className="pb-4 text-center text-xs text-[#54616e]">
          This is not financial advice. Just market context.
        </p>
      </div>
    </div>
  );
};
