import { useEffect, useRef, useState, useCallback } from 'react';
import { Candle } from '../services/api';

interface WebSocketMessage {
    event: string;
    data: any;
}

interface MarketGuardianState {
    isConnected: boolean;
    streamStatus: string;
    availablePairs: string[];
    availableTimeframes: string[];
    availableScenarios: string[];
    selectedPair: string | null;
    selectedTimeframe: string | null;
    currentScenario: string | null;
    candles: Candle[];
    lastCandle: Candle | null;
    metrics: {
        volumeRatio: number;
        rangePercent: number;
        priceChangePercent: number;
        trades: number;
        lastPrice?: number;
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
    orderbook: any | null;
    tradesFeed: any[];
}

interface UseMarketSocketOptions {
    onRiskAlert?: (alert: any) => void;
    onEvent?: (event: string, data: any) => void;
    enabled?: boolean;
}

export const useMarketSocket = ({ onRiskAlert, onEvent, enabled = true }: UseMarketSocketOptions = {}) => {
    const [state, setState] = useState<MarketGuardianState>({
        isConnected: false,
        streamStatus: 'stopped',
        availablePairs: [],
        availableTimeframes: [],
        availableScenarios: [],
        selectedPair: null,
        selectedTimeframe: null,
        currentScenario: null,
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
        orderbook: null,
        tradesFeed: [],
    });

    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const fallbackTimerRef = useRef<NodeJS.Timeout | null>(null);
    const receivedChunkRef = useRef(false);
    const maxCandles = 60;
    const maxTrades = 50;

    const clearFallbackTimer = () => {
        if (fallbackTimerRef.current) {
            clearTimeout(fallbackTimerRef.current);
            fallbackTimerRef.current = null;
        }
    };

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
            if (onEvent) onEvent('ws_error', error);
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
            clearFallbackTimer();
        };
    }, [enabled, connect]);

    const handleMessage = (msg: WebSocketMessage) => {
        const { event, data } = msg;
        if (onEvent) onEvent(event, data);

        switch (event) {
            case 'connected':
                setState(prev => {
                    const availablePairs = Array.isArray(data.availablePairs) ? data.availablePairs : prev.availablePairs;
                    const availableTimeframes = Array.isArray(data.availableTimeframes) ? data.availableTimeframes : prev.availableTimeframes;
                    const availableScenarios = Array.isArray(data.availableScenarios) ? data.availableScenarios : prev.availableScenarios;
                    const streamStatusValue = (() => {
                        if (!data.streamStatus) return prev.streamStatus;
                        if (typeof data.streamStatus === 'string') return data.streamStatus;
                        if (typeof data.streamStatus === 'object') {
                            return (
                                data.streamStatus.status ||
                                data.streamStatus.state ||
                                data.streamStatus.mode ||
                                prev.streamStatus
                            );
                        }
                        return prev.streamStatus;
                    })();
                    const nextSelectedPair =
                        data.pair ??
                        data.selectedPair ??
                        prev.selectedPair ??
                        availablePairs[0] ??
                        null;
                    const nextSelectedTimeframe =
                        data.timeframe ??
                        data.selectedTimeframe ??
                        prev.selectedTimeframe ??
                        availableTimeframes[0] ??
                        null;
                    const nextScenario =
                        data.scenario ??
                        data.currentScenario ??
                        prev.currentScenario ??
                        null;
                    return {
                        ...prev,
                        availablePairs,
                        availableTimeframes,
                        availableScenarios,
                        selectedPair: nextSelectedPair,
                        selectedTimeframe: nextSelectedTimeframe,
                        currentScenario: nextScenario,
                        streamStatus: streamStatusValue,
                        candles: data.candleHistory ? data.candleHistory.slice(-maxCandles) : prev.candles,
                        lastCandle: data.candleHistory ? data.candleHistory[data.candleHistory.length - 1] || null : prev.lastCandle,
                    };
                });
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
                    if (data?.openTime) {
                        const newOpen = { ...data, isClosed: false } as Candle;
                        newCandles.push(newOpen);
                        if (newCandles.length > maxCandles) newCandles.shift();
                        return { ...prev, candles: newCandles, lastCandle: newOpen };
                    }

                    return prev;
                });
                break;
            case 'candle_closed':
                setState(prev => {
                    const newCandles = [...prev.candles];
                    const existingIdx = newCandles.findIndex(c => c.openTime === data.openTime);
                    if (existingIdx >= 0) {
                        newCandles[existingIdx] = data;
                    } else {
                        newCandles.push(data);
                    }
                    if (newCandles.length > maxCandles) newCandles.shift();
                    return { ...prev, candles: newCandles, lastCandle: data };
                });
                break;
            case 'ticker':
                setState(prev => ({
                    ...prev,
                    metrics: {
                        ...prev.metrics,
                        priceChangePercent: data.priceChangePercent ?? prev.metrics.priceChangePercent,
                        trades: data.trades ?? prev.metrics.trades,
                        lastPrice: data.lastPrice ?? data.price ?? prev.metrics.lastPrice,
                    }
                }));
                break;
            case 'risk_alert':
                if (onRiskAlert) onRiskAlert(data);
                receivedChunkRef.current = false;
                clearFallbackTimer();
                setState(prev => ({
                    ...prev,
                    currentAlert: {
                        id: data.alertId,
                        riskLevel: data.riskLevel,
                        message: data.message || 'Risk detected...',
                        signals: data.signals || [],
                        isStreaming: data.streaming === true
                    },
                    explanationChunk: null,
                    explanationComplete: false,
                    metrics: {
                        ...prev.metrics,
                        volumeRatio: data.metrics?.volumeRatio || prev.metrics.volumeRatio,
                        rangePercent: data.metrics?.rangePercent || prev.metrics.rangePercent
                    }
                }));
                if (data.streaming === true && data.alertId) {
                    fallbackTimerRef.current = setTimeout(() => {
                        if (!receivedChunkRef.current) {
                            setState(prev => {
                                if (!prev.currentAlert || prev.currentAlert.id !== data.alertId) return prev;
                                const safeMessage =
                                    prev.currentAlert.message && prev.currentAlert.message !== 'Risk detected...'
                                        ? prev.currentAlert.message
                                        : 'Market conditions changed measurably. Price movement variance increased compared to previous intervals.';
                                return {
                                    ...prev,
                                    currentAlert: {
                                        ...prev.currentAlert,
                                        message: safeMessage,
                                        isStreaming: true
                                    }
                                };
                            });
                        }
                    }, 3000);
                }
                break;
            case 'explanation_chunk':
                receivedChunkRef.current = true;
                clearFallbackTimer();
                setState(prev => {
                    if (prev.currentAlert && prev.currentAlert.id === data.alertId) {
                        const chunkText = data.partialText ?? data.chunk ?? '';
                        const newMessage = prev.currentAlert.message === 'Risk detected...'
                            ? chunkText
                            : prev.currentAlert.message + chunkText;

                        return {
                            ...prev,
                            explanationChunk: chunkText,
                            currentAlert: {
                                ...prev.currentAlert,
                                message: newMessage,
                                isStreaming: true
                            }
                        };
                    }
                    return prev;
                });
                break;
            case 'explanation_complete':
                clearFallbackTimer();
                setState(prev => {
                    if (prev.currentAlert && prev.currentAlert.id === data.alertId) {
                        return {
                            ...prev,
                            explanationComplete: true,
                            explanationChunk: null,
                            currentAlert: {
                                ...prev.currentAlert,
                                message: data.message || prev.currentAlert.message,
                                isStreaming: false
                            }
                        };
                    }
                    return { ...prev, explanationComplete: true };
                });
                break;
            case 'state_change':
                if (data?.type === 'market_state') {
                    const nextState =
                        data.market_state?.state ??
                        data.market_state?.riskLevel ??
                        data.market_state ??
                        data.state ??
                        data.newState;
                    if (nextState) {
                        setState(prev => ({
                            ...prev,
                            marketState: nextState,
                            metrics: {
                                ...prev.metrics,
                                volumeRatio: data.market_state?.metrics?.volumeRatio ?? data.metrics?.volumeRatio ?? prev.metrics.volumeRatio,
                                rangePercent: data.market_state?.metrics?.rangePercent ?? data.metrics?.rangePercent ?? prev.metrics.rangePercent
                            }
                        }));
                    }
                } else if (data?.type === 'scenario_changed') {
                    const nextScenario =
                        data.scenario_changed?.scenario ??
                        data.scenario ??
                        data.currentScenario ??
                        null;
                    if (nextScenario) {
                        setState(prev => ({ ...prev, currentScenario: nextScenario }));
                    }
                }
                break;
            case 'stream_started':
                setState(prev => ({ ...prev, streamStatus: 'running' }));
                break;
            case 'stream_stopped':
                setState(prev => ({ ...prev, streamStatus: 'stopped' }));
                break;
            case 'orderbook':
                setState(prev => ({ ...prev, orderbook: data }));
                break;
            case 'trade':
                setState(prev => ({
                    ...prev,
                    tradesFeed: [data, ...prev.tradesFeed].slice(0, maxTrades)
                }));
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
