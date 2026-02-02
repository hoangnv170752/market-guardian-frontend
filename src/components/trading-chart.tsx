'use client';

import { useEffect, useState } from 'react';
import * as SyncfusionCharts from '@syncfusion/ej2-react-charts';

const { ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject, CandleSeries, Category, Tooltip, DateTime, Zoom, Logarithmic, Crosshair, Legend } = SyncfusionCharts;

interface CandleData {
  x: Date;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface TradingChartProps {
  isVolatile: boolean;
}

export const TradingChart = ({ isVolatile }: TradingChartProps) => {
  const [candles, setCandles] = useState<CandleData[]>([]);
  const [currentPrice, setCurrentPrice] = useState(1.0850);

  useEffect(() => {
    // Initialize with mock data
    const initialCandles: CandleData[] = [];
    let basePrice = 1.0850;
    const now = new Date();
    
    for (let i = 60; i >= 0; i--) {
      const change = (Math.random() - 0.5) * 0.002;
      basePrice += change;
      const open = basePrice;
      const close = basePrice + (Math.random() - 0.5) * 0.001;
      const high = Math.max(open, close) + Math.random() * 0.0005;
      const low = Math.min(open, close) - Math.random() * 0.0005;
      
      const time = new Date(now.getTime() - i * 60000);
      
      initialCandles.push({
        x: time,
        open,
        high,
        low,
        close,
      });
    }
    
    setCandles(initialCandles);
    const lastCandle = initialCandles[initialCandles.length - 1];
    if (lastCandle) {
      setCurrentPrice(lastCandle.close);
    }
  }, []);

  useEffect(() => {
    // Update price periodically
    const interval = setInterval(() => {
      setCandles(prev => {
        if (prev.length === 0) return prev;
        const lastCandle = prev[prev.length - 1];
        if (!lastCandle) return prev;
        
        const volatilityFactor = isVolatile ? 0.005 : 0.001;
        const change = (Math.random() - 0.5) * volatilityFactor;
        const newPrice = lastCandle.close + change;
        
        const newCandle: CandleData = {
          x: new Date(),
          open: lastCandle.close,
          close: newPrice,
          high: Math.max(lastCandle.close, newPrice) + Math.random() * 0.0003,
          low: Math.min(lastCandle.close, newPrice) - Math.random() * 0.0003,
        };
        
        setCurrentPrice(newPrice);
        return [...prev.slice(-60), newCandle];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isVolatile]);

  const lastCandle = candles[candles.length - 1];
  const prevCandle = candles[candles.length - 2];
  const priceChange = lastCandle && prevCandle
    ? ((lastCandle.close - prevCandle.close) / prevCandle.close) * 100
    : 0;

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">EUR/USD</h2>
          <p className="text-sm text-gray-600">Euro / US Dollar</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-900">{currentPrice.toFixed(4)}</div>
          <div className={`text-sm font-semibold ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
          </div>
        </div>
      </div>
      <ChartComponent
        id="candlestick-chart"
        primaryXAxis={{
          valueType: 'DateTime',
          majorGridLines: { width: 0 },
          crosshairTooltip: { enable: true },
        }}
        primaryYAxis={{
          title: 'Price',
          labelFormat: '{value}',
          minimum: candles.length > 0 ? Math.min(...candles.map(c => c.low)) * 0.999 : 1.08,
          maximum: candles.length > 0 ? Math.max(...candles.map(c => c.high)) * 1.001 : 1.09,
          interval: 0.001,
          lineStyle: { width: 0 },
          majorTickLines: { width: 0 },
        }}
        tooltip={{ enable: true, shared: true }}
        crosshair={{ enable: true, lineType: 'Vertical' }}
        zoomSettings={{
          enableMouseWheelZooming: true,
          enablePinchZooming: true,
          enableSelectionZooming: true,
          mode: 'XY',
          toolbarItems: ['Zoom', 'ZoomIn', 'ZoomOut', 'Pan', 'Reset']
        }}
        chartArea={{ border: { width: 0 } }}
        width="100%"
        height="400px"
        background="transparent"
      >
        <Inject services={[CandleSeries, Category, Tooltip, DateTime, Zoom, Logarithmic, Crosshair, Legend]} />
        <SeriesCollectionDirective>
          <SeriesDirective
            dataSource={candles}
            xName="x"
            yName="close"
            low="low"
            high="high"
            open="open"
            close="close"
            type="Candle"
            bearFillColor="#ef4444"
            bullFillColor="#22c55e"
            name="EUR/USD"
          />
        </SeriesCollectionDirective>
      </ChartComponent>
    </div>
  );
};
