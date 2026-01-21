import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Transaction, TransactionItem, Shop } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatCurrency, formatDate } from '@/lib/utils';
import { CheckCircle, Home, PlusCircle } from 'lucide-react';

interface ReceiptPreviewProps {
    transaction: Transaction;
    items: TransactionItem[];
    shop: Shop;
    onNewSale: () => void;
}

export function ReceiptPreview({ transaction, items, shop, onNewSale }: ReceiptPreviewProps) {
    const [qrDataUrl, setQrDataUrl] = useState<string>('');

    useEffect(() => {
        // Generate QR payload
        // Payload matches requirement: { shop, date, items, total, payment }
        const payload = {
            s: shop.name,
            d: transaction.created_at,
            i: items.map(x => ({ n: x.product_name, p: x.price, q: x.quantity })),
            t: transaction.total,
            p: transaction.payment_type
        };

        // We encode this into a URL parameters for the viewer
        const jsonString = JSON.stringify(payload);
        const encoded = encodeURIComponent(jsonString);
        // Ideally this URL points to the hosted version of the app
        const url = `${window.location.origin}/receipt?data=${encoded}`;

        QRCode.toDataURL(url, { width: 300, margin: 2 }, (err, url) => {
            if (!err) setQrDataUrl(url);
        });
    }, [transaction, items, shop]);

    return (
        <div className="fixed inset-0 z-50 bg-gray-100 flex flex-col items-center justify-center p-4 animate-in zoom-in duration-300">
            <Card className="w-full max-w-md shadow-xl border-t-8 border-t-blue-600">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <CardTitle className="text-xl">Payment Successful!</CardTitle>
                    <p className="text-gray-500 font-mono text-sm">{transaction.id.slice(0, 8)}</p>
                </CardHeader>
                <CardContent className="space-y-6">

                    {/* Receipt Summary */}
                    <div className="bg-gray-50 p-4 rounded-xl space-y-2 border border-dashed border-gray-300">
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>{formatCurrency(transaction.total)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>Change</span>
                            <span>{formatCurrency(0)}</span>
                        </div>
                    </div>

                    {/* QR Code */}
                    <div className="flex flex-col items-center space-y-2">
                        {qrDataUrl && <img src={qrDataUrl} alt="Receipt QR" className="rounded-lg border p-1" />}
                        <p className="text-xs text-center text-gray-400">Scan to view receipt</p>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-1 gap-3">
                        <Button size="lg" onClick={onNewSale} className="w-full">
                            <PlusCircle className="mr-2 h-5 w-5" />
                            New Sale
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
