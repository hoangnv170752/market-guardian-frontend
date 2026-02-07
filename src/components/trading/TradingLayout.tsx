import { useState, useEffect, useRef, useCallback } from 'react';
import { ChartWidget } from './ChartWidget';
import { MarketStats } from './MarketStats';
import { OrderPanel } from './OrderPanel';
import { PositionsPanel } from './PositionsPanel';
import { ScenarioControls } from './ScenarioControls';
import { AIRiskModal } from '../ai-risk-modal';
import { User, fetchMarketConfig } from '../../services/api';
import { getAuthUser, clearAuthData, isAuthenticated } from '../../utils/auth';
import { useMarketSocket } from '../../hooks/use-market-socket';
import { EventLog } from './EventLog';
import { OrderbookTradesPanel } from './OrderbookTradesPanel';

export const TradingLayout = () => {
    const [timeframe, setTimeframe] = useState('1m');
    const [pair, setPair] = useState('BTC/USDT');
    const [user, setUser] = useState<User | null>(null);
    const [activity, setActivity] = useState<'viewing_chart' | 'placing_order' | 'idle'>('viewing_chart');
    const [eventLog, setEventLog] = useState<Array<{ id: string; timestamp: number; level: 'info' | 'warn' | 'error'; message: string }>>([]);
    const [fallbackConfig, setFallbackConfig] = useState<{ pairs: string[]; timeframes: string[]; scenarios: string[] }>({
        pairs: [],
        timeframes: [],
        scenarios: []
    });

    // AI Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [followupRequestedForAlert, setFollowupRequestedForAlert] = useState<string | null>(null);
    const [followupRequestedAtTick, setFollowupRequestedAtTick] = useState<number | null>(null);
    const [followupUsedForAlert, setFollowupUsedForAlert] = useState<string | null>(null);
    const [isExplainLoading, setIsExplainLoading] = useState(false);
    const fallbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const alertIdRef = useRef<string | null>(null);
    const didInitPairRef = useRef(false);
    const didInitTimeframeRef = useRef(false);
    const didAutoStartRef = useRef(false);
    const addLog = useCallback((level: 'info' | 'warn' | 'error', message: string) => {
        setEventLog(prev => {
            const next = [...prev, { id: `${Date.now()}-${prev.length}`, timestamp: Date.now(), level, message }];
            return next.slice(-200);
        });
    }, []);

    const {
        isConnected,
        streamStatus,
        availablePairs,
        availableTimeframes,
        availableScenarios,
        selectedPair,
        selectedTimeframe,
        currentScenario,
        marketState,
        candles,
        metrics,
        orderbook,
        tradesFeed,
        currentAlert,
        currentAlertId,
        streamingAlertId,
        streamTextByAlert,
        explanationCompleteTick,
        lastExplanationCompleteAlertId,
        sendMessage
    } = useMarketSocket({
        onEvent: (event, data) => {
            if (event === 'error' || event === 'ws_error') {
                addLog('error', data?.message || 'WebSocket error');
            }
        }
    });

    const pairsList = availablePairs.length ? availablePairs : fallbackConfig.pairs;
    const timeframesList = availableTimeframes.length ? availableTimeframes : fallbackConfig.timeframes;
    const scenariosList = availableScenarios.length ? availableScenarios : fallbackConfig.scenarios;

    const resolveScenario = useCallback(
        (scenario: 'pump' | 'crash') => {
            if (!scenariosList.length) return null;
            const normalized = scenario.toLowerCase();
            const exact = scenariosList.find(s => s.toLowerCase() === normalized);
            if (exact) return exact;
            const fuzzy = scenariosList.find(s => s.toLowerCase().includes(normalized));
            return fuzzy || null;
        },
        [scenariosList]
    );

    const clearExplainTimeout = useCallback(() => {
        if (fallbackTimeoutRef.current) {
            clearTimeout(fallbackTimeoutRef.current);
            fallbackTimeoutRef.current = null;
        }
    }, []);

    useEffect(() => {
        return () => clearExplainTimeout();
    }, [clearExplainTimeout]);

    useEffect(() => {
        if (!didInitPairRef.current && selectedPair) {
            setPair(selectedPair);
            didInitPairRef.current = true;
        }
    }, [selectedPair]);

    useEffect(() => {
        if (!didInitTimeframeRef.current && selectedTimeframe) {
            setTimeframe(selectedTimeframe);
            didInitTimeframeRef.current = true;
        }
    }, [selectedTimeframe]);

    useEffect(() => {
        const loadConfig = async () => {
            try {
                const config = await fetchMarketConfig();
                setFallbackConfig({
                    pairs: config.availablePairs || [],
                    timeframes: config.availableTimeframes || [],
                    scenarios: config.availableScenarios || []
                });
                addLog('info', 'Loaded market config');
            } catch (err) {
                addLog('warn', 'Failed to load market config');
            }
        };
        loadConfig();
    }, []);

    // Get user data
    useEffect(() => {
        if (!isAuthenticated()) {
            window.location.href = '/sign-in';
            return;
        }
        const userData = getAuthUser();
        setUser(userData);
    }, []);

    useEffect(() => {
        if (currentAlertId && currentAlertId !== alertIdRef.current) {
            alertIdRef.current = currentAlertId;
            setFollowupRequestedForAlert(null);
            setFollowupRequestedAtTick(null);
            setIsExplainLoading(false);
            clearExplainTimeout();
            setIsModalOpen(true);
            addLog('warn', `Risk alert: ${currentAlert?.riskLevel || 'UNKNOWN'}`);
        }
    }, [currentAlertId, currentAlert?.riskLevel, addLog, clearExplainTimeout]);

    const handleTimeframeChange = (tf: string) => {
        setTimeframe(tf);
        sendMessage('set_timeframe', { timeframe: tf });
        addLog('info', `Timeframe set to ${tf}`);
    };

    const handlePairChange = (nextPair: string) => {
        setPair(nextPair);
        sendMessage('set_pair', { pair: nextPair });
        addLog('info', `Pair set to ${nextPair}`);
    };

    const handleSignOut = () => {
        clearAuthData();
        window.location.href = '/sign-in';
    };

    const handleExplainMore = useCallback(() => {
        if (!currentAlertId) return;
        if (isExplainLoading) return;
        if (followupUsedForAlert === currentAlertId) return;

        setIsExplainLoading(true);
        setFollowupRequestedForAlert(currentAlertId);
        setFollowupRequestedAtTick(explanationCompleteTick);
        sendMessage('alert_response', { alertId: currentAlertId, response: 'waited' });
        addLog('info', `Requested follow-up explanation for alert ${currentAlertId}`);

        clearExplainTimeout();
        const requestedAlertId = currentAlertId;
        fallbackTimeoutRef.current = setTimeout(() => {
            setIsExplainLoading(false);
            setFollowupRequestedForAlert(prev => (prev === requestedAlertId ? null : prev));
            setFollowupRequestedAtTick(null);
            addLog('warn', `Follow-up explanation timeout for alert ${requestedAlertId}`);
        }, 15000);
    }, [
        currentAlertId,
        isExplainLoading,
        followupUsedForAlert,
        explanationCompleteTick,
        sendMessage,
        addLog,
        clearExplainTimeout
    ]);

    useEffect(() => {
        if (!followupRequestedForAlert) return;
        if (followupRequestedAtTick === null) return;
        if (!lastExplanationCompleteAlertId) return;
        if (lastExplanationCompleteAlertId !== followupRequestedForAlert) return;
        if (explanationCompleteTick <= followupRequestedAtTick) return;

        setFollowupUsedForAlert(lastExplanationCompleteAlertId);
        setFollowupRequestedForAlert(null);
        setFollowupRequestedAtTick(null);
        setIsExplainLoading(false);
        clearExplainTimeout();
        addLog('info', `Follow-up explanation completed for alert ${lastExplanationCompleteAlertId}`);
    }, [
        explanationCompleteTick,
        followupRequestedForAlert,
        followupRequestedAtTick,
        lastExplanationCompleteAlertId,
        clearExplainTimeout,
        addLog
    ]);

    useEffect(() => {
        if (pairsList.length && !pairsList.includes(pair)) {
            const nextPair = pairsList[0];
            if (!nextPair) return;
            setPair(nextPair);
            sendMessage('set_pair', { pair: nextPair });
        }
    }, [pairsList, pair, sendMessage]);

    useEffect(() => {
        if (timeframesList.length && !timeframesList.includes(timeframe)) {
            const nextTf = timeframesList[0];
            if (!nextTf) return;
            setTimeframe(nextTf);
            sendMessage('set_timeframe', { timeframe: nextTf });
        }
    }, [timeframesList, timeframe, sendMessage]);

    useEffect(() => {
        if (isConnected) {
            addLog('info', 'WebSocket connected');
        } else {
            addLog('warn', 'WebSocket disconnected');
            didAutoStartRef.current = false;
        }
    }, [isConnected]);

    useEffect(() => {
        if (!isConnected) return;
        if (!didAutoStartRef.current) {
            sendMessage('start_stream', { mode: 'normal', speed: 'normal', pair });
            addLog('info', 'Auto-started stream');
            didAutoStartRef.current = true;
        }
        sendMessage('get_orderbook', { depth: 20 });
        sendMessage('get_trades', { count: 20 });
    }, [isConnected, pair, timeframe, sendMessage]);

    useEffect(() => {
        if (streamStatus) {
            const label = typeof streamStatus === 'string' ? streamStatus : 'unknown';
            addLog('info', `Stream status: ${label}`);
        }
    }, [streamStatus]);

    const activeAlertId = currentAlertId || currentAlert?.id || null;
    const streamedAlertMessage = activeAlertId ? streamTextByAlert[activeAlertId] : '';
    const alertMessage = streamedAlertMessage || currentAlert?.message || '';
    const isStreaming =
        currentAlert?.isStreaming ||
        (Boolean(streamingAlertId) && Boolean(activeAlertId) && streamingAlertId === activeAlertId);
    const explainUsedForCurrent = Boolean(activeAlertId) && followupUsedForAlert === activeAlertId;

    return (
        <div className="flex flex-col h-screen w-full bg-[#0b0f14] text-white font-sans overflow-hidden" suppressHydrationWarning>
            {/* Top Bar with Logo, Stats & User Info */}
            <div className="flex flex-col sm:flex-row bg-[#0b0f14] border-b border-[#283341] px-2 sm:px-4 py-2 gap-2 sm:gap-4">
                {/* Top Row on Mobile: Logo + User */}
                <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <img 
                            src="/images/logo-mg.png" 
                            alt="Market Guardian" 
                            className="h-7 w-7 sm:h-8 sm:w-8 object-contain"
                        />
                        <span className="text-base sm:text-lg font-bold text-white">Market Guardian</span>
                    </div>
                    
                    {/* Mobile User Info */}
                    <div className="flex sm:hidden items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-semibold">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="p-1.5 hover:bg-[#1a2332] rounded-lg transition-colors"
                            title="Sign Out"
                        >
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Center: Market Stats - Hidden on small mobile */}
                <div className="hidden md:flex flex-1 justify-center">
                    <MarketStats metrics={metrics} />
                </div>

                {/* Right: User Info & Controls */}
                <div className="flex items-center gap-1 sm:gap-3 flex-wrap sm:flex-nowrap">
                    <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                        <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border ${isConnected ? 'border-[#2bd47d] text-[#2bd47d]' : 'border-[#ff5c5c] text-[#ff5c5c]'}`}>
                            {isConnected ? 'CONN' : 'DISC'}
                        </span>
                        <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border ${streamStatus === 'running' ? 'border-[#2bd47d] text-[#2bd47d]' : 'border-[#54616e] text-[#9aa7b2]'}`}>
                            {streamStatus === 'running' ? 'STREAM' : 'STOP'}
                        </span>
                        <span className={`hidden sm:inline text-xs px-2 py-1 rounded-full border ${marketState === 'HIGH_RISK' ? 'border-[#ff5c5c] text-[#ff5c5c]' : marketState === 'VOLATILE' ? 'border-[#f0b90b] text-[#f0b90b]' : 'border-[#2bd47d] text-[#2bd47d]'}`}>
                            {marketState}
                        </span>
                        <span className="hidden lg:inline text-xs px-2 py-1 rounded-full border border-[#283341] text-[#9aa7b2]">
                            {currentScenario ? `SCENARIO: ${currentScenario}` : 'SCENARIO: NORMAL'}
                        </span>
                    </div>

                    <div className="hidden sm:block">
                        <ScenarioControls
                            onScenario={(scenario) => {
                                const resolved = resolveScenario(scenario);
                                if (!resolved) {
                                    addLog('warn', `Scenario not available: ${scenario}`);
                                    return;
                                }
                                sendMessage('set_scenario', {
                                    scenario: resolved,
                                    duration: 15,
                                    intensity: 1.0
                                });
                                addLog('warn', `Scenario triggered: ${resolved}`);
                            }}
                        />
                    </div>

                    <div className="hidden md:flex items-center gap-1 rounded bg-[#141b23] p-1">
                        <button
                            onClick={() => {
                                setActivity('viewing_chart');
                                sendMessage('user_activity', { activity: 'viewing_chart' });
                                addLog('info', 'Activity: viewing_chart');
                            }}
                            className={`px-2 py-1 text-xs rounded ${activity === 'viewing_chart' ? 'bg-[#283341] text-white' : 'text-[#9aa7b2]'}`}
                        >
                            Viewing
                        </button>
                        <button
                            onClick={() => {
                                setActivity('placing_order');
                                sendMessage('user_activity', { activity: 'placing_order' });
                                addLog('info', 'Activity: placing_order');
                            }}
                            className={`px-2 py-1 text-xs rounded ${activity === 'placing_order' ? 'bg-[#283341] text-white' : 'text-[#9aa7b2]'}`}
                        >
                            Trading
                        </button>
                    </div>
                    
                    {/* User Account Info */}
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#1a2332] rounded-lg border border-[#283341]">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-semibold">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="text-sm">
                            <div className="text-white font-medium">{user?.name || 'User'}</div>
                        </div>
                    </div>

                    {/* Desktop Sign Out Button */}
                    <button
                        onClick={handleSignOut}
                        className="hidden sm:block p-2 hover:bg-[#1a2332] rounded-lg transition-colors"
                        title="Sign Out"
                    >
                        <svg className="h-5 w-5 text-gray-400 hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Main Grid */}
            <div className="flex-1 overflow-hidden flex flex-col lg:grid lg:grid-cols-[1fr_360px] lg:grid-rows-1 p-2 sm:p-3 gap-2 sm:gap-3">

                {/* Left Column: Chart & Positions */}
                <div className="flex flex-col gap-2 sm:gap-3 lg:min-h-0">
                    {/* Chart Area - Fixed height on mobile */}
                    <div className="h-[350px] sm:h-[400px] lg:flex-1 lg:min-h-[400px] shrink-0">
                        <ChartWidget
                            candles={candles}
                            timeframe={timeframe}
                            onTimeframeChange={handleTimeframeChange}
                            availableTimeframes={timeframesList}
                            pair={pair}
                            availablePairs={pairsList}
                            onPairChange={handlePairChange}
                        />
                    </div>

                    {/* Bottom Panel (Positions) */}
                    <div className="h-[250px] hidden lg:block">
                        <PositionsPanel />
                    </div>
                </div>

                {/* Right Column: Order Entry - Scrollable on mobile */}
                <div className="flex-1 lg:h-full overflow-y-auto flex flex-col gap-2 sm:gap-3">
                    <OrderPanel />
                    <OrderbookTradesPanel orderbook={orderbook} trades={tradesFeed} />
                    <EventLog entries={eventLog} />
                    
                    {/* Mobile Positions Tab */}
                    <div className="lg:hidden">
                        <PositionsPanel />
                    </div>
                </div>
            </div>

            {/* AI Intervention Modal */}
            <AIRiskModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    if (activeAlertId) {
                        sendMessage('alert_response', { alertId: activeAlertId, response: 'dismissed' });
                    }
                }}
                onExplainMore={handleExplainMore}
                onContinue={() => {
                    setIsModalOpen(false);
                    if (activeAlertId) {
                        sendMessage('alert_response', { alertId: activeAlertId, response: 'continued' });
                    }
                }}
                alertMessage={alertMessage}
                riskLevel={currentAlert?.riskLevel || 'high'}
                signals={currentAlert?.signals || []}
                metrics={metrics}
                isStreaming={isStreaming}
                isExplainLoading={isExplainLoading}
                isExplainUsed={explainUsedForCurrent}
            />
        </div>
    );
};
