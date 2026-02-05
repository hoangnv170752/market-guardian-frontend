'use client';

import { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Settings2 } from 'lucide-react';

export const OrderPanel = () => {
    const [side, setSide] = useState<'buy' | 'sell'>('buy');
    const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
    const [leverage, setLeverage] = useState(10);
    const [amount, setAmount] = useState('1000');

    // Derived states
    const isBuy = side === 'buy';
    const accentColor = isBuy ? 'bg-[#2bd47d]' : 'bg-[#ff5c5c]';
    const accentText = isBuy ? 'text-[#2bd47d]' : 'text-[#ff5c5c]';

    return (
        <div className="flex flex-col h-full bg-[#0b0f14] border border-[#283341] rounded-lg p-4 gap-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white">Place Order</h3>
                <Settings2 className="w-4 h-4 text-[#9aa7b2] cursor-pointer hover:text-white" />
            </div>

            {/* Buy/Sell Tabs */}
            <div className="flex bg-[#141b23] p-1 rounded-lg">
                <button
                    onClick={() => setSide('buy')}
                    className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all ${side === 'buy' ? 'bg-[#2bd47d] text-[#05130b] shadow-sm' : 'text-[#9aa7b2] hover:text-white'
                        }`}
                >
                    Buy Long
                </button>
                <button
                    onClick={() => setSide('sell')}
                    className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all ${side === 'sell' ? 'bg-[#ff5c5c] text-white shadow-sm' : 'text-[#9aa7b2] hover:text-white'
                        }`}
                >
                    Sell Short
                </button>
            </div>

            {/* Order Type */}
            <div className="flex gap-4 border-b border-[#283341] pb-3">
                {['Market', 'Limit', 'Stop'].map(type => (
                    <button
                        key={type}
                        onClick={() => setOrderType(type.toLowerCase() as any)}
                        className={`text-sm font-medium pb-2 -mb-3.5 border-b-2 transition-colors ${orderType === type.toLowerCase()
                                ? 'border-[#4ea1ff] text-white'
                                : 'border-transparent text-[#9aa7b2] hover:text-white'
                            }`}
                    >
                        {type}
                    </button>
                ))}

            </div>

            {/* Inputs */}
            <div className="space-y-4">
                {/* Limit Price Input (only if limit) */}
                {orderType === 'limit' && (
                    <div className="space-y-1">
                        <label className="text-xs text-[#9aa7b2]">Price (USDT)</label>
                        <div className="relative">
                            <input
                                type="number"
                                defaultValue="98500.00"
                                className="w-full bg-[#141b23] border border-[#283341] rounded-md px-3 py-2 text-white outline-none focus:border-[#4ea1ff] text-right font-mono text-sm"
                            />
                            <span className="absolute left-3 top-2 text-xs text-[#54616e] font-medium">USDT</span>
                        </div>
                    </div>
                )}

                <div className="space-y-1">
                    <label className="text-xs text-[#9aa7b2]">Amount (USDT)</label>
                    <div className="relative">
                        <input
                            type="text"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full bg-[#141b23] border border-[#283341] rounded-md px-3 py-2 text-white outline-none focus:border-[#4ea1ff] text-right font-mono text-sm"
                        />
                        <span className="absolute left-3 top-2 text-xs text-[#54616e] font-medium">Size</span>
                    </div>
                </div>

                {/* Leverage Slider */}
                <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-xs text-[#9aa7b2]">
                        <span>Leverage</span>
                        <span className="text-white font-mono">{leverage}x</span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="100"
                        value={leverage}
                        onChange={(e) => setLeverage(Number(e.target.value))}
                        className="w-full h-1.5 bg-[#283341] rounded-lg appearance-none cursor-pointer accent-[#4ea1ff]"
                    />
                    <div className="flex justify-between text-[10px] text-[#54616e]">
                        <span>1x</span>
                        <span>20x</span>
                        <span>50x</span>
                        <span>100x</span>
                    </div>
                </div>
            </div>

            {/* Summary */}
            <div className="mt-auto space-y-3 pt-4 border-t border-[#283341]">
                <div className="flex justify-between text-xs">
                    <span className="text-[#9aa7b2]">Cost</span>
                    <span className="text-white font-mono">${(Number(amount) / leverage).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs">
                    <span className="text-[#9aa7b2]">Max Buy</span>
                    <span className="text-white font-mono">0.00 BTC</span>
                </div>

                <button
                    className={`w-full py-3.5 rounded-lg font-bold text-sm text-white shadow-lg transition-transform active:scale-[0.98] flex items-center justify-center gap-2 ${accentColor}`}
                >
                    {isBuy ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {isBuy ? 'Buy / Long' : 'Sell / Short'} BTC
                </button>
            </div>
        </div>
    );
};
