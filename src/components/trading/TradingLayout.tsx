import { useMemo, useState, useEffect, useRef } from 'react';
import { MarketSimulator, Timeframe } from '../../lib/market-simulator';
import { ChartWidget } from './ChartWidget';
import { MarketStats } from './MarketStats';
import { OrderPanel } from './OrderPanel';
import { PositionsPanel } from './PositionsPanel';
import { ScenarioControls } from './ScenarioControls';
import { AIRiskModal } from '../ai-risk-modal';
import { analyzeMarketEvent, startDemoSession, User } from '../../services/api';
import { getAuthUser, clearAuthData, isAuthenticated } from '../../utils/auth';

export const TradingLayout = () => {
    // Initialize Simulator once
    const simulator = useMemo(() => new MarketSimulator({
        startPrice: 98450.00,
        volatility: 0.0005, // Moderate volatility
        symbol: 'BTC/USDT'
    }), []);

    const [timeframe, setTimeframe] = useState<Timeframe>('1m');
    const [user, setUser] = useState<User | null>(null);

    // AI Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [alertData, setAlertData] = useState<{ message: string; riskLevel: string; streaming?: boolean } | null>(null);
    const lastAnalysisTime = useRef(0);
    const sessionIdRef = useRef<string | null>(null);

    // Get user data
    useEffect(() => {
        if (!isAuthenticated()) {
            window.location.href = '/sign-in';
            return;
        }
        const userData = getAuthUser();
        setUser(userData);
    }, []);

    // Init Session
    useEffect(() => {
        const initSession = async () => {
            try {
                const session = await startDemoSession();
                sessionIdRef.current = session.sessionId;
                console.log('Session initialized:', session.sessionId);
            } catch (err) {
                console.error('Failed to init session:', err);
            }
        };
        initSession();
    }, []);

    // Subscribe to simulator ticks and analyze
    useEffect(() => {
        const unsubscribe = simulator.subscribe(async (candle, isClosed) => {
            const now = Date.now();

            // Analyze on candle close OR every 2 seconds if volatility is high
            // We use a simple throttle here
            if (isClosed || now - lastAnalysisTime.current > 2000) {
                lastAnalysisTime.current = now;

                try {
                    // Call Backend API
                    const analysis = await analyzeMarketEvent({
                        sessionId: sessionIdRef.current || undefined,
                        open: candle.open,
                        high: candle.high,
                        low: candle.low,
                        close: candle.close,
                        volume: candle.volume || 0,
                        timestamp: candle.time as number,
                        userContext: 'viewing_chart'
                    });

                    if (analysis.riskDetected) {
                        setAlertData({
                            message: analysis.message || 'High market volatility detected.',
                            riskLevel: analysis.state === 'HIGH_RISK' ? 'HIGH_RISK' : 'VOLATILE',
                            streaming: false
                        });
                        setIsModalOpen(true);
                    }
                } catch (err) {
                    console.error('Analysis API failed:', err);
                }
            }
        });

        // Also listen to manual triggers for immediate feedback (Fallback/UX)
        const unsubscribeAlerts = simulator.onAlert((alert) => {
            // We can use this to show an immediate "Analyzing..." state if we want,
            // or just let the API loop handle it naturally.
            // For better UX during "Pump" button press, let's open it.
            setAlertData({
                message: "Abnormal market activity detected. Analyzing market data...",
                riskLevel: 'HIGH_RISK',
                streaming: true
            });
            setIsModalOpen(true);
        });

        return () => {
            unsubscribe();
            unsubscribeAlerts();
        };
    }, [simulator]);

    const handleTimeframeChange = (tf: Timeframe) => {
        setTimeframe(tf);
        simulator.setTimeframe(tf);
    };

    const handleSignOut = () => {
        clearAuthData();
        window.location.href = '/sign-in';
    };

    return (
        <div className="flex flex-col h-screen w-full bg-[#0b0f14] text-white font-sans overflow-hidden">
            {/* Top Bar with Logo, Stats & User Info */}
            <div className="flex bg-[#0b0f14] border-b border-[#283341] px-4 py-2 items-center justify-between gap-4">
                {/* Left: Logo */}
                <div className="flex items-center gap-3 min-w-fit">
                    <img 
                        src="/images/logo-mg.png" 
                        alt="Market Guardian" 
                        className="h-8 w-8 object-contain"
                    />
                    <span className="text-lg font-bold text-white hidden sm:block">Market Guardian</span>
                </div>

                {/* Center: Market Stats */}
                <div className="flex-1 flex justify-center">
                    <MarketStats />
                </div>

                {/* Right: User Info & Controls */}
                <div className="flex items-center gap-3 min-w-fit">
                    <ScenarioControls simulator={simulator} />
                    
                    {/* User Account Info */}
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#1a2332] rounded-lg border border-[#283341]">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-semibold">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="text-sm">
                            <div className="text-white font-medium">{user?.name || 'User'}</div>
                        </div>
                    </div>

                    {/* Sign Out Button */}
                    <button
                        onClick={handleSignOut}
                        className="p-2 hover:bg-[#1a2332] rounded-lg transition-colors"
                        title="Sign Out"
                    >
                        <svg className="h-5 w-5 text-gray-400 hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Main Grid */}
            <div className="flex-1 overflow-hidden p-3 gap-3 grid grid-cols-1 lg:grid-cols-[1fr_320px] grid-rows-[1fr_auto] lg:grid-rows-1">

                {/* Left Column: Chart & Positions */}
                <div className="flex flex-col gap-3 min-h-0">
                    {/* Chart Area */}
                    <div className="flex-1 min-h-[400px]">
                        <ChartWidget
                            simulator={simulator}
                            timeframe={timeframe}
                            onTimeframeChange={handleTimeframeChange}
                        />
                    </div>

                    {/* Bottom Panel (Positions) */}
                    <div className="h-[250px] hidden lg:block">
                        <PositionsPanel />
                    </div>
                </div>

                {/* Right Column: Order Entry */}
                <div className="w-full h-full overflow-y-auto">
                    <OrderPanel />
                </div>

                {/* Mobile Positions Tab (if needed) */}
                <div className="lg:hidden h-[300px]">
                    <PositionsPanel />
                </div>
            </div>

            {/* AI Intervention Modal */}
            <AIRiskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onExplainMore={() => {
                    // In demo, just keep open or maybe show more detail
                    setIsModalOpen(false);
                }}
                alertMessage={alertData?.message || ''}
                riskLevel={alertData?.riskLevel || 'high'}
            />
        </div>
    );
};
