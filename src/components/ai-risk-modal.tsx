'use client';

interface AIRiskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExplainMore: () => void;
  showExtraInfo: boolean;
}

export const AIRiskModal = ({ isOpen, onClose, onExplainMore, showExtraInfo }: AIRiskModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-lg rounded-xl bg-white p-8 shadow-2xl border-2 border-yellow-400">
        <div className="mb-6 flex items-start gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100">
            <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Market Guardian Alert</h3>
            <p className="text-sm text-gray-600">AI-powered risk detection</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <p className="text-gray-700 leading-relaxed">
            The market just moved very quickly downward. This kind of sharp drop usually means higher uncertainty right now. 
            A lot of people get emotional here and end up losing more than they planned.
          </p>
          
          {showExtraInfo && (
            <div className="rounded-lg bg-yellow-50 p-4 border border-yellow-200">
              <p className="text-gray-700 text-sm leading-relaxed">
                <strong className="text-yellow-700">Context:</strong> Volatility has spiked by 2.1% in the last 5 minutes. 
                The recent trend is bearish with increased selling pressure. Historical data shows that 73% of trades made 
                during similar conditions result in losses for retail traders. Taking a moment to assess the situation 
                could help you make a more informed decision.
              </p>
            </div>
          )}

          <p className="text-sm text-gray-600 italic">
            No pressure — want a quick explanation of what's happening, or prefer to continue?
          </p>
        </div>

        <div className="flex gap-3">
          {!showExtraInfo && (
            <button
              onClick={onExplainMore}
              className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Explain more
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            Continue anyway
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-gray-500">
          This is not financial advice. Just market context.
        </p>
      </div>
    </div>
  );
};
