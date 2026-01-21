import React, { useState } from 'react';
import { useShop } from '@/context/ShopContext';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
    const { shop } = useShop();
    const navigate = useNavigate();
    const [name, setName] = useState(shop?.name || '');
    const [currency, setCurrency] = useState(shop?.currency || 'UZS');
    const [loading, setLoading] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!shop) return;
        setLoading(true);

        await db.shops.update(shop.id, {
            name,
            currency
        });

        // In a real app we'd sync this to supabase here

        setLoading(false);
        navigate('/');
    };

    if (!shop) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="bg-white p-4 shadow-sm flex items-center space-x-3 sticky top-0 z-10">
                <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                    <ArrowLeft />
                </Button>
                <h1 className="text-xl font-bold">Settings</h1>
            </div>

            <div className="flex-1 p-4 max-w-md mx-auto w-full">
                <Card>
                    <CardHeader>
                        <CardTitle>Shop Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSave} className="space-y-6">
                            <Input
                                label="Shop Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Currency</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setCurrency('UZS')}
                                        className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${currency === 'UZS' ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold' : 'border-gray-200 hover:bg-gray-50'}`}
                                    >
                                        UZS
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setCurrency('USD')}
                                        className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${currency === 'USD' ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold' : 'border-gray-200 hover:bg-gray-50'}`}
                                    >
                                        USD
                                    </button>
                                </div>
                            </div>

                            <Button type="submit" className="w-full" size="lg" isLoading={loading}>
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
