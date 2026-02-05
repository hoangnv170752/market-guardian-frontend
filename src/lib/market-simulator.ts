/**
 * Market Simulator for Local Trading Dashboard
 * 
 * Simulates real-time market data with:
 * - Geometric Brownian Motion (Random Walk)
 * - Tick-level updates aggregation to OHLC
 * - Timeframe support (1m, 5m etc.)
 */

export interface SimulationConfig {
    startPrice: number;
    volatility: number;
    symbol: string;
}

export interface Tick {
    price: number;
    time: number;
    volume: number;
}

export interface OHLC {
    time: number; // UNIX timestamp
    open: number;
    high: number;
    low: number;
    close: number;
    volume?: number;
}

// Timeframe helpers
export type Timeframe = '1m' | '5m' | '15m';

const TIMEFRAME_SECONDS: Record<Timeframe, number> = {
    '1m': 60,
    '5m': 300,
    '15m': 900,
};

export class MarketSimulator {
    private price: number;
    private subscribers: ((candle: OHLC, isClosed: boolean) => void)[] = [];
    private lastTickTime: number;
    private currentCandle: OHLC | null = null;
    private timer: NodeJS.Timeout | null = null;
    private timeframe: Timeframe = '1m';
    private history: OHLC[] = [];
    private scenario: 'normal' | 'pump' | 'crash' = 'normal';
    private scenarioRemainingTicks = 0;
    private alertSubscribers: ((alert: any) => void)[] = [];

    constructor(private config: SimulationConfig) {
        this.price = config.startPrice;
        this.lastTickTime = Math.floor(Date.now() / 1000);
    }

    // Generate historical candles
    public generateHistory(count: number, timeframe: Timeframe = '1m'): OHLC[] {
        this.timeframe = timeframe;
        const seconds = TIMEFRAME_SECONDS[timeframe];
        const data: OHLC[] = [];
        let currentPrice = this.price;
        let time = this.lastTickTime - (count * seconds);

        // Quantize start time to timeframe boundary
        time = Math.floor(time / seconds) * seconds;

        for (let i = 0; i < count; i++) {
            const open = currentPrice;
            // Simulate 'seconds' worth of ticks for one candle
            let high = open;
            let low = open;
            let close = open;
            let volume = 0;

            // Simple approximation of High/Low for history
            const volatility = this.config.volatility * Math.sqrt(seconds / 60);
            const change = (Math.random() - 0.5) * volatility * currentPrice;
            close = open + change;

            // Randomize High/Low around Open/Close
            high = Math.max(open, close) + Math.random() * (volatility * currentPrice * 0.5);
            low = Math.min(open, close) - Math.random() * (volatility * currentPrice * 0.5);
            volume = Math.floor(Math.random() * 1000) + 100;

            data.push({
                time: time as any, // Charts expects UTCTimestamp usually, but number works for Lightweight charts
                open,
                high,
                low,
                close,
                volume
            });

            currentPrice = close;
            time += seconds;
        }

        this.price = currentPrice;
        this.lastTickTime = time;
        this.history = data;
        return data;
    }

    public subscribe(callback: (candle: OHLC, isClosed: boolean) => void) {
        this.subscribers.push(callback);
        return () => {
            this.subscribers = this.subscribers.filter(s => s !== callback);
        };
    }

    public onAlert(callback: (alert: any) => void) {
        this.alertSubscribers.push(callback);
        return () => {
            this.alertSubscribers = this.alertSubscribers.filter(s => s !== callback);
        };
    }

    public triggerScenario(type: 'pump' | 'crash') {
        this.scenario = type;
        this.scenarioRemainingTicks = 20; // Last for 20 ticks (approx 4 seconds)

        // Emit fake alert
        const alert = {
            id: Date.now().toString(),
            riskLevel: 'HIGH_RISK',
            message: type === 'pump'
                ? 'Abnormal buying pressure detected. Possible market manipulation event in progress.'
                : 'Sudden high-volume selling detected. Potential flash crash scenario.',
            signals: type === 'pump'
                ? ['Volume spike > 500%', 'Order book imbalance', 'RSI Divergence']
                : ['Cascading liquidations', 'Bid liquidity evaporated', 'High volatility'],
            streaming: true
        };

        this.alertSubscribers.forEach(cb => cb(alert));
    }

    public start() {
        if (this.timer) return;
        this.timer = setInterval(() => this.tick(), 200); // 5 ticks per second for smooth appearance
    }

    public stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    private tick() {
        const now = Math.floor(Date.now() / 1000);
        const tfSeconds = TIMEFRAME_SECONDS[this.timeframe];

        // Base random movement
        let change = (Math.random() - 0.5) * (this.config.volatility / 20) * this.price;

        // Apply Scenario Bias
        if (this.scenarioRemainingTicks > 0) {
            this.scenarioRemainingTicks--;
            const bias = this.price * 0.002; // 0.2% per tick
            if (this.scenario === 'pump') change += bias;
            if (this.scenario === 'crash') change -= bias;
        } else {
            this.scenario = 'normal';
        }

        const newPrice = this.price + change;
        const volume = Math.floor(Math.random() * (this.scenario !== 'normal' ? 1000 : 10));

        this.price = newPrice;

        // Determine bucket start time
        const bucketTime = Math.floor(now / tfSeconds) * tfSeconds;

        if (!this.currentCandle) {
            // First tick or fresh start
            this.currentCandle = {
                time: bucketTime,
                open: newPrice,
                high: newPrice,
                low: newPrice,
                close: newPrice,
                volume
            };
        } else if (bucketTime > this.currentCandle.time) {
            // New candle started! Close the previous one.
            // Emit closed event for the *previous* candle first if needed?
            // Usually we just emit the final update for previous and then start new.
            // Actually, subscribers need to know if it's a new bar.

            // First, notify subscribers that the OLD candle is closed (final update)
            this.subscribers.forEach(s => s(this.currentCandle!, true));

            // Start new candle
            this.currentCandle = {
                time: bucketTime,
                open: newPrice, // Gap from previous close is possible in real markets, or use prev close
                high: newPrice,
                low: newPrice,
                close: newPrice,
                volume
            };
        } else {
            // Update existing candle
            this.currentCandle.close = newPrice;
            this.currentCandle.high = Math.max(this.currentCandle.high, newPrice);
            this.currentCandle.low = Math.min(this.currentCandle.low, newPrice);
            this.currentCandle.volume = (this.currentCandle.volume || 0) + volume;
        }

        // Emit update
        this.subscribers.forEach(s => s(this.currentCandle!, false));
    }

    public setTimeframe(tf: Timeframe) {
        // In a real app we'd re-aggregate ticks. 
        // Here we'll just restart history generation to keep it simple and consistent.
        this.stop();
        this.timeframe = tf;
        // Optionally regenerate history? Consumers usually call generateHistory again.
    }
}
