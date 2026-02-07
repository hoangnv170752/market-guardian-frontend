'use client';

interface EventLogEntry {
    id: string;
    timestamp: number;
    level: 'info' | 'warn' | 'error';
    message: string;
}

interface EventLogProps {
    entries: EventLogEntry[];
}

const levelStyles: Record<EventLogEntry['level'], string> = {
    info: 'text-[#9aa7b2]',
    warn: 'text-[#f0b90b]',
    error: 'text-[#ff5c5c]',
};

export const EventLog = ({ entries }: EventLogProps) => {
    return (
        <div className="flex flex-col h-full bg-[#0b0f14] border border-[#283341] rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white">Event Log</h3>
                <span className="text-xs text-[#54616e]">{entries.length} entries</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 text-xs">
                {entries.length === 0 && (
                    <div className="text-[#54616e]">No events yet.</div>
                )}
                {entries.map(entry => (
                    <div key={entry.id} className="flex items-start gap-3 border-b border-[#141b23] pb-2">
                        <span className="text-[#54616e] font-mono w-[72px]">
                            {new Date(entry.timestamp).toLocaleTimeString()}
                        </span>
                        <span className={`${levelStyles[entry.level]} flex-1`}>{entry.message}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
