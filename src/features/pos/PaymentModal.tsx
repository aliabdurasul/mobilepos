import React from 'react';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { Banknote, CreditCard, X } from 'lucide-react';

interface PaymentModalProps {
    total: number;
    onClose: () => void;
    onComplete: (type: 'cash' | 'card') => Promise<void>;
}

export function PaymentModal({ total, onClose, onComplete }: PaymentModalProps) {
    return (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6">
                <div className="text-center mb-8">
                    <p className="text-gray-500 mb-1">Total Amount</p>
                    <h2 className="text-4xl font-bold text-gray-900">{formatCurrency(total)}</h2>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={() => onComplete('cash')}
                        className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-green-100 bg-green-50 text-green-700 hover:bg-green-100 transition-colors active:scale-95"
                    >
                        <div className="flex items-center space-x-3">
                            <Banknote className="w-6 h-6" />
                            <span className="font-bold text-lg">Cash</span>
                        </div>
                        <span className="text-sm font-medium bg-white/50 px-2 py-1 rounded">Nakit</span>
                    </button>

                    <button
                        onClick={() => onComplete('card')}
                        className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors active:scale-95"
                    >
                        <div className="flex items-center space-x-3">
                            <CreditCard className="w-6 h-6" />
                            <span className="font-bold text-lg">Card</span>
                        </div>
                        <span className="text-sm font-medium bg-white/50 px-2 py-1 rounded">Kart</span>
                    </button>
                </div>

                <div className="mt-6">
                    <Button variant="ghost" className="w-full" onClick={onClose}>
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
}
