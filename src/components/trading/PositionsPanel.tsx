'use client';

import { useState } from 'react';

export const PositionsPanel = () => {
    const [activeTab, setActiveTab] = useState<'positions' | 'orders' | 'history'>('positions');

    return (
        <div className="flex flex-col h-full w-full bg-[#0b0f14] border-t lg:border-t-0 lg:border border-[#283341] rounded-lg overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-[#283341] px-2">
                {['positions', 'orders', 'history'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-4 py-3 text-sm font-medium capitalize border-b-2 transition-colors ${activeTab === tab
                                ? 'border-[#4ea1ff] text-white'
                                : 'border-transparent text-[#9aa7b2] hover:text-white'
                            }`}
                    >
                        {tab} <span className="text-xs text-[#54616e] ml-1">(0)</span>
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 p-0 overflow-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#141b23] sticky top-0">
                        <tr>
                            <th className="px-4 py-2 text-xs font-medium text-[#9aa7b2]">Symbol</th>
                            <th className="px-4 py-2 text-xs font-medium text-[#9aa7b2]">Size</th>
                            <th className="px-4 py-2 text-xs font-medium text-[#9aa7b2]">Entry Price</th>
                            <th className="px-4 py-2 text-xs font-medium text-[#9aa7b2]">Mark Price</th>
                            <th className="px-4 py-2 text-xs font-medium text-[#9aa7b2]">PNL (ROE%)</th>
                            <th className="px-4 py-2 text-xs font-medium text-[#9aa7b2]">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#283341]">
                        {/* Empty State */}
                        <tr>
                            <td colSpan={6} className="px-4 py-12 text-center text-sm text-[#54616e]">
                                No open positions
                            </td>
                        </tr>

                        {/* Example simulation if needed later */}
                        {/* 
                    <tr className="hover:bg-[#141b23]/50">
                        <td className="px-4 py-3 text-sm font-bold text-white flex items-center gap-2">
                            <span className="w-1 h-4 bg-[#2bd47d] rounded-full"></span>
                            BTC/USDT
                        </td>
                        <td className="px-4 py-3 text-sm font-mono text-white">0.052</td>
                        <td className="px-4 py-3 text-sm font-mono text-white">96,230.50</td>
                        <td className="px-4 py-3 text-sm font-mono text-white">98,450.00</td>
                        <td className="px-4 py-3 text-sm font-mono text-[#2bd47d]">+115.40 (+2.35%)</td>
                        <td className="px-4 py-3 text-sm text-[#4ea1ff] cursor-pointer hover:underline">Close</td>
                    </tr>
                    */}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
