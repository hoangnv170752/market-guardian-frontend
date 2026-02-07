'use client';

import { createChart, ColorType, IChartApi, ISeriesApi, Time, CrosshairMode, CandlestickSeries, HistogramSeries } from 'lightweight-charts';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Candle } from '../../services/api';

interface ChartWidgetProps {
    candles: Candle[];
    pair: string;
    timeframe: string;
    availablePairs: string[];
    availableTimeframes: string[];
    onPairChange: (pair: string) => void;
    onTimeframeChange: (tf: string) => void;
}

const toChartTime = (t: number) => {
    if (!t) return 0;
    return t > 1_000_000_000_000 ? Math.floor(t / 1000) : t;
};

export const ChartWidget = ({
    candles,
    pair,
    timeframe,
    availablePairs,
    availableTimeframes,
    onPairChange,
    onTimeframeChange
}: ChartWidgetProps) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartApiRef = useRef<IChartApi | null>(null);
    const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
    const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);

    const [lastCandle, setLastCandle] = useState<Candle | null>(null);

    // Initialize Chart
    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: '#0b0f14' },
                textColor: '#9aa7b2',
            },
            grid: {
                vertLines: { color: '#141b23' },
                horzLines: { color: '#141b23' },
            },
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
                borderColor: '#283341',
            },
            rightPriceScale: {
                borderColor: '#283341',
            },
            crosshair: {
                mode: CrosshairMode.Normal,
                vertLine: {
                    labelBackgroundColor: '#283341',
                },
                horzLine: {
                    labelBackgroundColor: '#283341',
                }
            }
        });

        // Candlestick Series
        const candleSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#2bd47d',
            downColor: '#ff5c5c',
            borderVisible: false,
            wickUpColor: '#2bd47d',
            wickDownColor: '#ff5c5c',
        }) as ISeriesApi<"Candlestick">;

        // Volume Series (Overlay)
        const volumeSeries = chart.addSeries(HistogramSeries, {
            color: '#26a69a',
            priceFormat: {
                type: 'volume',
            },
            priceScaleId: '', // Set as an overlay
        }) as ISeriesApi<"Histogram">;

        // Position volume at the bottom
        volumeSeries.priceScale().applyOptions({
            scaleMargins: {
                top: 0.8, // Highest volume bar takes up bottom 20%
                bottom: 0,
            },
        });

        chartApiRef.current = chart;
        candleSeriesRef.current = candleSeries;
        volumeSeriesRef.current = volumeSeries;

        // Responsive Resize
        const handleResize = () => {
            if (chartContainerRef.current && chartApiRef.current) {
                chartApiRef.current.applyOptions({
                    width: chartContainerRef.current.clientWidth,
                    height: chartContainerRef.current.clientHeight
                });
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
            chartApiRef.current = null;
            candleSeriesRef.current = null;
            volumeSeriesRef.current = null;
        };
    }, []);

    const sortedCandles = useMemo(() => {
        if (!candles?.length) return [];
        const ordered = [...candles].sort((a, b) => {
            const timeDiff = a.openTime - b.openTime;
            if (timeDiff !== 0) return timeDiff;
            const closedDiff = Number(a.isClosed) - Number(b.isClosed);
            if (closedDiff !== 0) return closedDiff;
            return (a.closeTime || 0) - (b.closeTime || 0);
        });
        const byTime = new Map<number, Candle>();
        for (const c of ordered) {
            const t = toChartTime(c.openTime);
            if (!t) continue;
            byTime.set(t, c);
        }
        return Array.from(byTime.entries())
            .sort((a, b) => a[0] - b[0])
            .map(([, c]) => c);
    }, [candles]);

    // Handle Data Updates
    useEffect(() => {
        if (!candleSeriesRef.current || !volumeSeriesRef.current) return;

        if (!sortedCandles.length) {
            candleSeriesRef.current.setData([]);
            volumeSeriesRef.current.setData([]);
            setLastCandle(null);
            return;
        }

        // Filter out candles with null/undefined values
        const validCandles = sortedCandles.filter(c => 
            c.open != null && c.high != null && c.low != null && c.close != null &&
            typeof c.open === 'number' && typeof c.high === 'number' && 
            typeof c.low === 'number' && typeof c.close === 'number'
        );

        if (!validCandles.length) {
            candleSeriesRef.current.setData([]);
            volumeSeriesRef.current.setData([]);
            setLastCandle(null);
            return;
        }

        const chartData = validCandles.map(c => ({
            time: toChartTime(c.openTime) as Time,
            open: c.open,
            high: c.high,
            low: c.low,
            close: c.close,
        }));

        const volumeData = validCandles.map(c => ({
            time: toChartTime(c.openTime) as Time,
            value: c.volume || 0,
            color: c.close >= c.open ? 'rgba(43, 212, 125, 0.2)' : 'rgba(255, 92, 92, 0.2)',
        }));

        candleSeriesRef.current.setData(chartData);
        volumeSeriesRef.current.setData(volumeData);
        setLastCandle(validCandles[validCandles.length - 1] || null);
    }, [sortedCandles]);

    // Format Helpers
    const formatPrice = (p: number) => p.toFixed(2);
    const formatChange = (open: number, close: number) => {
        const diff = close - open;
        const pct = (diff / open) * 100;
        const sign = diff >= 0 ? '+' : '';
        return `${sign}${pct.toFixed(2)}%`;
    };

    return (
        <div className="flex h-full w-full flex-col bg-[#0b0f14] border border-[#283341] rounded-lg overflow-hidden">
            {/* Chart Header */}
            <div className="flex items-center justify-between border-b border-[#283341] px-4 py-3">
                <div className="flex items-center gap-4">
                    {/* Symbol */}
                    <div className="flex items-baseline gap-2">
                        <h2 className="text-lg font-bold text-white">{pair}</h2>
                        <span className="text-xs text-[#9aa7b2]">Live Market</span>
                    </div>

                    {/* Timeframe Selector */}
                    <div className="flex items-center gap-2">
                        <select
                            value={pair}
                            onChange={(e) => onPairChange(e.target.value)}
                            className="bg-[#141b23] border border-[#283341] text-xs text-white rounded px-2 py-1"
                        >
                            {(availablePairs.length ? availablePairs : [pair]).map(p => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                        <div className="flex rounded bg-[#141b23] p-0.5">
                            {(availableTimeframes.length ? availableTimeframes : [timeframe]).map((tf) => (
                                <button
                                    key={tf}
                                    onClick={() => onTimeframeChange(tf)}
                                    className={`px-3 py-1 text-xs font-medium rounded transition-colors ${timeframe === tf
                                        ? 'bg-[#283341] text-white'
                                        : 'text-[#9aa7b2] hover:text-white'
                                        }`}
                                >
                                    {tf}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Dynamic Stats (Last Candle) */}
                {lastCandle && (
                    <div className="hidden sm:flex items-center gap-4 text-xs font-mono">
                        <div className="flex flex-col items-end">
                            <span className={lastCandle.close >= lastCandle.open ? 'text-[#2bd47d]' : 'text-[#ff5c5c]'}>
                                {formatPrice(lastCandle.close)}
                            </span>
                            <span className="text-[#9aa7b2]">Last</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className={lastCandle.close >= lastCandle.open ? 'text-[#2bd47d]' : 'text-[#ff5c5c]'}>
                                {formatChange(lastCandle.open, lastCandle.close)}
                            </span>
                            <span className="text-[#9aa7b2]">Change</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-white">{formatPrice(lastCandle.high)}</span>
                            <span className="text-[#9aa7b2]">High</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-white">{formatPrice(lastCandle.low)}</span>
                            <span className="text-[#9aa7b2]">Low</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Chart Area */}
            <div className="relative flex-1" ref={chartContainerRef} style={{ minHeight: '400px' }}>
                {/* Chart renders here */}
            </div>
        </div>
    );
};
