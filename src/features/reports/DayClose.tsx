import React, { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ArrowLeft, Lock, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '@/context/ShopContext';
import { v4 as uuidv4 } from 'uuid';

export default function DayClose() {
    const navigate = useNavigate();
    const { shop } = useShop();
    const [confirmOpen, setConfirmOpen] = useState(false);

    // Calculate today's totals
    const today = new Date().toISOString().split('T')[0];

    const transactions = useLiveQuery(
        () => db.transactions.where('business_date').equals(today).toArray(),
        [today]
    );

    const stats = (transactions || []).reduce((acc, t) => {
        acc.total += t.total;
        acc.count += 1;
        if (t.payment_type === 'cash') acc.cash += t.total;
        if (t.payment_type === 'card') acc.card += t.total;
        return acc;
    }, { total: 0, cash: 0, card: 0, count: 0 });

    const handleDayClose = async () => {
        if (!shop) return;

        const reportId = uuidv4();

        const report = {
            id: reportId,
            shop_id: shop.id,
            business_date: today,
            total_sales: stats.total,
            cash_total: stats.cash,
            card_total: stats.card,
            transaction_count: stats.count,
            closed_at: new Date().toISOString(),
            synced: false
        };

        await db.daily_reports.add(report);

        // Realistically we would "Advance" the business date here or mark the current day as closed in a "SystemState" table.
        // For this MVP, by saving the report we acknowledge it's closed.
        // Reset logic implies future transactions will be on "tomorrow" or simply a new session.

        navigate('/');
    };

    if (!shop) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="bg-white p-4 shadow-sm flex items-center space-x-3 sticky top-0 z-10">
                <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                    <ArrowLeft />
                </Button>
                <h1 className="text-xl font-bold">Gün Sonu (Day Close)</h1>
            </div>

            <div className="flex-1 p-4 space-y-4">
                <Card className="border-l-4 border-l-blue-600">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Business Date</CardTitle>
                        <div className="text-2xl font-bold">{formatDate(today)}</div>
                    </CardHeader>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <p className="text-sm text-gray-500">Total Sales</p>
                            <p className="text-xl font-bold text-blue-600">{formatCurrency(stats.total)}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <p className="text-sm text-gray-500">Transactions</p>
                            <p className="text-xl font-bold">{stats.count}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <p className="text-sm text-gray-500">Cash</p>
                            <p className="text-xl font-bold text-green-600">{formatCurrency(stats.cash)}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <p className="text-sm text-gray-500">Card</p>
                            <p className="text-xl font-bold text-indigo-600">{formatCurrency(stats.card)}</p>
                        </CardContent>
                    </Card>
                </div>

                <Button
                    size="lg"
                    className="w-full mt-8 bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => setConfirmOpen(true)}
                >
                    <Lock className="mr-2 h-5 w-5" />
                    Günü Kapat (Close Day)
                </Button>
            </div>

            {confirmOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6">
                        <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
                            <AlertTriangle className="text-red-600 h-6 w-6" />
                        </div>
                        <h2 className="text-xl font-bold text-center mb-2">Are you sure?</h2>
                        <p className="text-gray-500 text-center mb-6 text-sm">
                            This will close the current business day and save the daily report. This action cannot be undone.
                        </p>

                        <div className="space-y-4 bg-gray-50 p-4 rounded-xl mb-6">
                            <div className="flex justify-between text-sm">
                                <span>Total</span>
                                <span className="font-bold">{formatCurrency(stats.total)}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
                                Cancel
                            </Button>
                            <Button className="bg-red-600 hover:bg-red-700" onClick={handleDayClose}>
                                Confirm Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
