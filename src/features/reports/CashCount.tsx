import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { formatCurrency } from '@/lib/utils';
import { Card } from '@/components/ui/Card';

interface CashCountProps {
    expectedTotal: number;
}

export function CashCount({ expectedTotal }: CashCountProps) {
    const [counts, setCounts] = useState<{ [key: string]: number }>({
        '100000': 0,
        '50000': 0,
        '20000': 0,
        '10000': 0,
        '5000': 0,
        '2000': 0,
        '1000': 0,
        'coins': 0 // Lump sum for coins
    });

    const total = Object.entries(counts).reduce((sum, [denom, count]) => {
        if (denom === 'coins') return sum + count;
        return sum + (parseInt(denom) * count);
    }, 0);

    const diff = total - expectedTotal;

    return (
        <Card className="p-4 space-y-4">
            <h3 className="font-bold text-lg">Cash Handling</h3>

            <div className="grid grid-cols-2 gap-3">
                {Object.keys(counts).filter(k => k !== 'coins').sort((a, b) => parseInt(b) - parseInt(a)).map(denom => (
                    <div key={denom} className="flex items-center space-x-2">
                        <span className="text-gray-500 w-16 text-right text-xs font-bold">{parseInt(denom) / 1000}k</span>
                        <Input
                            type="number"
                            pattern="[0-9]*"
                            inputMode="numeric"
                            className="h-9"
                            placeholder="0"
                            value={counts[denom] || ''}
                            onChange={e => setCounts({ ...counts, [denom]: parseInt(e.target.value || '0') })}
                        />
                    </div>
                ))}
                <div className="flex items-center space-x-2 col-span-2">
                    <span className="text-gray-500 w-16 text-right text-xs font-bold">Coins</span>
                    <Input
                        type="number"
                        pattern="[0-9]*"
                        inputMode="numeric"
                        className="h-9"
                        placeholder="Total Coin Value"
                        value={counts['coins'] || ''}
                        onChange={e => setCounts({ ...counts, 'coins': parseInt(e.target.value || '0') })}
                    />
                </div>
            </div>

            <div className="pt-4 border-t flex justify-between items-center">
                <div>
                    <p className="text-xs text-gray-500">Expected</p>
                    <p className="font-bold">{formatCurrency(expectedTotal)}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500">Counted</p>
                    <p className="font-bold text-blue-600">{formatCurrency(total)}</p>
                </div>
            </div>

            <div className={`p-2 rounded-lg text-center font-bold text-sm ${diff === 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                Difference: {diff > 0 ? '+' : ''}{formatCurrency(diff)}
            </div>
        </Card>
    );
}
