'use client';

import { Candle } from '../services/api';

export const TradingChart = ({ candles }: { candles: Candle[] }) => {
  const lastCandle = candles[candles.length - 1];
  const currentPrice = lastCandle ? lastCandle.close : 0;
  const prevCandle = candles[candles.length - 2];
  const priceChange = lastCandle && prevCandle
    ? ((lastCandle.close - prevCandle.close) / prevCandle.close) * 100
    : 0;

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">BTC/USDT</h2>
          <p className="text-sm text-gray-600">Bitcoin / Tether</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-900">${currentPrice.toFixed(2)}</div>
          <div className={`text-sm font-semibold ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Simple price list display */}
      <div className="flex-1 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-700">Recent Prices</h3>
        <div className="space-y-2">
          {[...candles].slice(-10).reverse().map((candle, index) => (
            <div key={index} className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm">
              <div className="text-sm text-gray-600">
                {new Date(candle.openTime).toLocaleTimeString()}
              </div>
              <div className="flex gap-4 text-sm">
                <span className="text-gray-700">O: ${candle.open.toFixed(2)}</span>
                <span className="text-gray-700">H: ${candle.high.toFixed(2)}</span>
                <span className="text-gray-700">L: ${candle.low.toFixed(2)}</span>
                <span className={`font-semibold ${candle.close >= candle.open ? 'text-green-600' : 'text-red-600'}`}>
                  C: ${candle.close.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
          {candles.length === 0 && (
            <div className="text-center text-sm text-gray-500 py-8">
              Waiting for market data...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
