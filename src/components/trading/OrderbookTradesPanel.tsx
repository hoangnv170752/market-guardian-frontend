'use client';

interface OrderbookTradesPanelProps {
    orderbook: any | null;
    trades: any[];
}

const formatLevel = (level: any) => {
    if (!level) return { price: '--', size: '--' };
    if (Array.isArray(level)) {
        return { price: level[0], size: level[1] };
    }
    if (typeof level === 'object') {
        return {
            price: level.price ?? level[0] ?? '--',
            size: level.size ?? level.quantity ?? level.amount ?? level[1] ?? '--'
        };
    }
    return { price: '--', size: '--' };
};

const formatTrade = (trade: any) => {
    if (!trade || typeof trade !== 'object') return { price: '--', size: '--', side: 'unknown' };
    const rawSide = trade.side;
    const side =
        typeof rawSide === 'string'
            ? rawSide.toLowerCase()
            : (trade.isBuyerMaker ?? trade.maker) ? 'sell' : 'buy';
    return {
        price: trade.price ?? trade.p ?? '--',
        size: trade.qty ?? trade.quantity ?? trade.size ?? trade.q ?? '--',
        side
    };
};

export const OrderbookTradesPanel = ({ orderbook, trades }: OrderbookTradesPanelProps) => {
    const bids = Array.isArray(orderbook?.bids) ? orderbook.bids.slice(0, 5) : [];
    const asks = Array.isArray(orderbook?.asks) ? orderbook.asks.slice(0, 5) : [];

    return (
        <div className="flex flex-col h-full bg-[#0b0f14] border border-[#283341] rounded-lg p-4">
            <h3 className="text-sm font-semibold text-white mb-3">Orderbook & Trades</h3>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <div className="text-xs text-[#9aa7b2] mb-2">Asks</div>
                    <div className="space-y-1 text-xs font-mono">
                        {asks.length === 0 && <div className="text-[#54616e]">No asks</div>}
                        {asks.map((level: any, idx: number) => {
                            const { price, size } = formatLevel(level);
                            return (
                                <div key={`ask-${idx}`} className="flex justify-between text-[#ff5c5c]">
                                    <span>{price}</span>
                                    <span>{size}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div>
                    <div className="text-xs text-[#9aa7b2] mb-2">Bids</div>
                    <div className="space-y-1 text-xs font-mono">
                        {bids.length === 0 && <div className="text-[#54616e]">No bids</div>}
                        {bids.map((level: any, idx: number) => {
                            const { price, size } = formatLevel(level);
                            return (
                                <div key={`bid-${idx}`} className="flex justify-between text-[#2bd47d]">
                                    <span>{price}</span>
                                    <span>{size}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <div className="text-xs text-[#9aa7b2] mb-2">Recent Trades</div>
                <div className="space-y-1 text-xs font-mono max-h-28 overflow-y-auto">
                    {trades.length === 0 && <div className="text-[#54616e]">No trades</div>}
                    {trades.slice(0, 10).map((trade: any, idx: number) => {
                        const t = formatTrade(trade);
                        const sideColor = t.side === 'sell' ? 'text-[#ff5c5c]' : 'text-[#2bd47d]';
                        return (
                            <div key={`trade-${idx}`} className={`flex justify-between ${sideColor}`}>
                                <span>{t.price}</span>
                                <span>{t.size}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
