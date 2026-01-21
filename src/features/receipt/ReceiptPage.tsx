import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';

export default function ReceiptPage() {
    const [searchParams] = useSearchParams();
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const rawData = searchParams.get('data');
        if (rawData) {
            try {
                const json = JSON.parse(decodeURIComponent(rawData)); // Try direct JSON
                setData(json);
            } catch (e) {
                // Maybe base64?
            }
        }
    }, [searchParams]);

    if (!data) return <div className="p-8 text-center text-gray-500">Invalid Receipt Link</div>;

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 flex justify-center">
            <Card className="w-full max-w-md shadow-sm bg-white print:shadow-none">
                <CardHeader className="text-center border-b border-dashed">
                    <CardTitle>{data.s}</CardTitle>
                    <p className="text-xs text-gray-500">{new Date(data.d).toLocaleString()}</p>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                        {data.i.map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between text-sm">
                                <span>{item.n} x{item.q}</span>
                                <span>{formatCurrency(item.p * item.q)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-dashed pt-4 flex justify-between font-bold text-lg">
                        <span>TOTAL</span>
                        <span>{formatCurrency(data.t)}</span>
                    </div>
                    <p className="text-xs text-center text-gray-400 mt-8">Thank you for visiting!</p>
                </CardContent>
            </Card>
        </div>
    );
}
