'use client';

export const MarketStats = () => {
    return (
        <div className="flex bg-[#0b0f14] border-b border-[#283341] px-4 py-2 overflow-x-auto gap-8 items-center">
            <div className="flex flex-col">
                <span className="text-[10px] text-[#9aa7b2] uppercase tracking-wider">24h Change</span>
                <span className="text-sm font-semibold text-[#2bd47d]">+5.24%</span>
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] text-[#9aa7b2] uppercase tracking-wider">24h High</span>
                <span className="text-sm font-semibold text-white">99,420.00</span>
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] text-[#9aa7b2] uppercase tracking-wider">24h Low</span>
                <span className="text-sm font-semibold text-white">92,100.50</span>
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] text-[#9aa7b2] uppercase tracking-wider">24h Volume (BTC)</span>
                <span className="text-sm font-semibold text-white">45,230.12</span>
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] text-[#9aa7b2] uppercase tracking-wider">Funding / 8h</span>
                <span className="text-sm font-semibold text-[#f0b90b]">0.0100%</span>
            </div>
        </div>
    );
};
