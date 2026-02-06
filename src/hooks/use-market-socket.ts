import { useEffect, useRef, useState, useCallback } from 'react';
import { Candle } from '../services/api';

interface WebSocketMessage {
    event: string;
    data: any;
}

interface MarketGuardianState {
    isConnected: boolean;
    candles: Candle[];
    lastCandle: Candle | null;
    metrics: {
        volumeRatio: number;
        rangePercent: number;
        priceChangePercent: number;
        trades: number;
    };
    currentAlert: {
        id: string;
        riskLevel: string;
        message: string;
        signals: string[];
        isStreaming: boolean;
    } | null;
    explanationChunk: string | null;
    explanationComplete: boolean;
    marketState: string;
}

interface UseMarketSocketOptions {
    onRiskAlert?: (alert: any) => void;
    enabled?: boolean;
}

export const useMarketSocket = ({ onRiskAlert, enabled = true }: UseMarketSocketOptions = {}) => {
    const [state, setState] = useState<MarketGuardianState>({
        isConnected: false,
        candles: [],
        lastCandle: null,
        metrics: {
            volumeRatio: 1.0,
            rangePercent: 0,
            priceChangePercent: 0,
            trades: 0,
        },
        currentAlert: null,
        explanationChunk: null,
        explanationComplete: false,
        marketState: 'NORMAL',
    });

    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const maxCandles = 60;

    const connect = useCallback(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN) return;

        // Use WebSocket URL from environment variable
        const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:4000/ws';

        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log('Connected to Market Guardian AI');
            setState(prev => ({ ...prev, isConnected: true }));
        };

        ws.onclose = () => {
            console.log('Disconnected from Market Guardian AI');
            setState(prev => ({ ...prev, isConnected: false }));
            // Reconnect after 3 seconds
            reconnectTimeoutRef.current = setTimeout(() => {
                connect();
            }, 3000);
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        ws.onmessage = (event) => {
            try {
                const msg: WebSocketMessage = JSON.parse(event.data);
                handleMessage(msg);
            } catch (e) {
                console.error('Failed to parse message:', e);
            }
        };
    }, []);

    useEffect(() => {
        if (enabled) {
            connect();
        }
        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, [enabled, connect]);

    const handleMessage = (msg: WebSocketMessage) => {
        const { event, data } = msg;

        switch (event) {
            case 'connected':
                if (data.candleHistory) {
                    setState(prev => ({
                        ...prev,
                        candles: data.candleHistory.slice(-maxCandles),
                        lastCandle: data.candleHistory[data.candleHistory.length - 1] || null,
                    }));
                }
                break;
            case 'candle':
                setState(prev => {
                    const newCandles = [...prev.candles];
                    const lastIdx = newCandles.length - 1;

                    if (lastIdx >= 0) {
                        const last = newCandles[lastIdx];
                        if (last && !last.isClosed) {
                            // Update the open candle
                            // We must ensure we preserve all required fields of Candle
                            const updatedCandle: Candle = {
                                ...last,
                                high: Math.max(last.high, data.high),
                                low: Math.min(last.low, data.low),
                                close: data.close,
                                volume: (last.volume || 0) + (data.volume || 0),
                                // If data has other override properties, use them?
                                // Usually ticker data is minimal.
                            };
                            newCandles[lastIdx] = updatedCandle;
                            return { ...prev, candles: newCandles, lastCandle: updatedCandle };
                        }
                    }
                    // If we fall through (empty or last is closed), and we get a 'candle' update,
                    // ideally we wait for 'candle_closed' or a full candle object.
                    // Ignoring partial updates if we don't have an open candle to update is safer
                    // unless 'data' is a full candle.

                    return prev;
                });
                break;
            case 'candle_closed':
                setState(prev => {
                    const newCandles = [...prev.candles, data];
                    if (newCandles.length > maxCandles) newCandles.shift();
                    return { ...prev, candles: newCandles, lastCandle: data };
                });
                break;
            case 'ticker':
                setState(prev => ({
                    ...prev,
                    metrics: {
                        ...prev.metrics,
                        priceChangePercent: data.priceChangePercent,
                        trades: data.trades
                    }
                }));
                break;
            case 'risk_alert':
                if (onRiskAlert) onRiskAlert(data);
                setState(prev => ({
                    ...prev,
                    currentAlert: {
                        id: data.alertId,
                        riskLevel: data.riskLevel,
                        message: 'Risk detected...',
                        signals: data.signals || [],
                        isStreaming: data.streaming
                    },
                    metrics: {
                        ...prev.metrics,
                        volumeRatio: data.metrics?.volumeRatio || prev.metrics.volumeRatio,
                        rangePercent: data.metrics?.rangePercent || prev.metrics.rangePercent
                    }
                }));
                break;
            case 'explanation_chunk':
                setState(prev => {
                    if (prev.currentAlert && prev.currentAlert.id === data.alertId) {
                        const newMessage = prev.currentAlert.message === 'Risk detected...'
                            ? data.chunk
                            : prev.currentAlert.message + data.chunk;

                        return {
                            ...prev,
                            explanationChunk: data.chunk,
                            currentAlert: {
                                ...prev.currentAlert,
                                message: newMessage
                            }
                        };
                    }
                    return prev;
                });
                break;
            case 'explanation_complete':
                setState(prev => ({ ...prev, explanationComplete: true }));
                break;
            case 'state_change':
                setState(prev => ({ ...prev, marketState: data.newState }));
                break;
            default:
                break;
        }
    };

    const sendMessage = useCallback((event: string, data: any = {}) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ event, data }));
        }
    }, []);

    return {
        ...state,
        sendMessage,
        isConnected: state.isConnected
    };
};
