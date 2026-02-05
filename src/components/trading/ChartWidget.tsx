'use client';

import { createChart, ColorType, IChartApi, ISeriesApi, Time, CrosshairMode, CandlestickSeries, HistogramSeries } from 'lightweight-charts';
import { useEffect, useRef, useState } from 'react';
import { MarketSimulator, OHLC, Timeframe } from '../../lib/market-simulator';

interface ChartWidgetProps {
    simulator: MarketSimulator;
    timeframe: Timeframe;
    onTimeframeChange: (tf: Timeframe) => void;
}

export const ChartWidget = ({ simulator, timeframe, onTimeframeChange }: ChartWidgetProps) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartApiRef = useRef<IChartApi | null>(null);
    const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
    const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);

    const [lastCandle, setLastCandle] = useState<OHLC | null>(null);

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

    // Handle Data & Subscription
    useEffect(() => {
        // Wait for chart to be initialized
        if (!candleSeriesRef.current || !volumeSeriesRef.current) return;

        // 1. Initial Data
        const history = simulator.generateHistory(300, timeframe);

        // Map to Lightweight Charts format
        const chartData = history.map(h => ({
            time: h.time as Time,
            open: h.open,
            high: h.high,
            low: h.low,
            close: h.close,
        }));

        const volumeData = history.map(h => ({
            time: h.time as Time,
            value: h.volume || 0,
            color: h.close >= h.open ? 'rgba(43, 212, 125, 0.2)' : 'rgba(255, 92, 92, 0.2)',
        }));

        candleSeriesRef.current.setData(chartData);
        volumeSeriesRef.current.setData(volumeData);

        // Set last candle for header stats
        setLastCandle(history[history.length - 1] || null);

        // 2. Realtime Updates
        const unsubscribe = simulator.subscribe((candle, isClosed) => {
            if (!candleSeriesRef.current || !volumeSeriesRef.current) return;

            const update = {
                time: candle.time as Time,
                open: candle.open,
                high: candle.high,
                low: candle.low,
                close: candle.close,
            };

            const volumeUpdate = {
                time: candle.time as Time,
                value: candle.volume || 0,
                color: candle.close >= candle.open ? 'rgba(43, 212, 125, 0.2)' : 'rgba(255, 92, 92, 0.2)',
            };

            candleSeriesRef.current.update(update);
            volumeSeriesRef.current.update(volumeUpdate);

            setLastCandle({ ...candle });
        });

        // Ensure simulator is started
        simulator.start();

        return () => {
            unsubscribe();
            // Don't stop simulator here if other components rely on it, 
            // but in this architecture, ChartWidget controls it.
            simulator.stop();
        };
    }, [simulator, timeframe]);

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
                        <h2 className="text-lg font-bold text-white">BTC/USDT</h2>
                        <span className="text-xs text-[#9aa7b2]">Bitcoin Index</span>
                    </div>

                    {/* Timeframe Selector */}
                    <div className="flex rounded bg-[#141b23] p-0.5">
                        {(['1m', '5m', '15m'] as Timeframe[]).map((tf) => (
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
