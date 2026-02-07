'use client';

interface MarketStatsProps {
    metrics: {
        priceChangePercent?: number;
        trades?: number;
        volumeRatio?: number;
        rangePercent?: number;
        lastPrice?: number;
    };
}

const formatNumber = (value?: number, suffix: string = '') => {
    if (value === undefined || value === null || Number.isNaN(value)) return '--';
    return `${value.toFixed(2)}${suffix}`;
};

export const MarketStats = ({ metrics }: MarketStatsProps) => {
    const change = metrics.priceChangePercent ?? 0;
    const changeColor = change >= 0 ? 'text-[#2bd47d]' : 'text-[#ff5c5c]';

    return (
        <div className="flex bg-[#0b0f14] border-b border-[#283341] px-4 py-2 overflow-x-auto gap-8 items-center">
            <div className="flex flex-col">
                <span className="text-[10px] text-[#9aa7b2] uppercase tracking-wider">24h Change</span>
                <span className={`text-sm font-semibold ${changeColor}`}>
                    {metrics.priceChangePercent !== undefined ? `${change >= 0 ? '+' : ''}${metrics.priceChangePercent.toFixed(2)}%` : '--'}
                </span>
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] text-[#9aa7b2] uppercase tracking-wider">Volume Ratio</span>
                <span className="text-sm font-semibold text-white">{formatNumber(metrics.volumeRatio, 'x')}</span>
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] text-[#9aa7b2] uppercase tracking-wider">Range %</span>
                <span className="text-sm font-semibold text-white">{formatNumber(metrics.rangePercent, '%')}</span>
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] text-[#9aa7b2] uppercase tracking-wider">Trades</span>
                <span className="text-sm font-semibold text-white">
                    {metrics.trades !== undefined ? metrics.trades.toLocaleString() : '--'}
                </span>
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] text-[#9aa7b2] uppercase tracking-wider">Last Price</span>
                <span className="text-sm font-semibold text-white">
                    {metrics.lastPrice !== undefined ? metrics.lastPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '--'}
                </span>
            </div>
        </div>
    );
};
