'use client';

import { TrendingUp, TrendingDown, Zap } from 'lucide-react';
interface ScenarioControlsProps {
    onScenario: (scenario: 'pump' | 'crash') => void;
}

export const ScenarioControls = ({ onScenario }: ScenarioControlsProps) => {

    const handlePump = () => {
        onScenario('pump');
    };

    const handleCrash = () => {
        onScenario('crash');
    };

    return (
        <div className="flex gap-2">
            <button
                onClick={handlePump}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#141b23] border border-[#2bd47d]/30 text-[#2bd47d] text-xs font-bold rounded hover:bg-[#2bd47d]/10 transition-colors"
                title="Trigger Pump Scenario"
            >
                <TrendingUp className="w-3 h-3" />
                PUMP
            </button>
            <button
                onClick={handleCrash}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#141b23] border border-[#ff5c5c]/30 text-[#ff5c5c] text-xs font-bold rounded hover:bg-[#ff5c5c]/10 transition-colors"
                title="Trigger Crash Scenario"
            >
                <TrendingDown className="w-3 h-3" />
                CRASH
            </button>
        </div>
    );
};
