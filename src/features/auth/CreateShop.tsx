import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

export default function CreateShop() {
    const [name, setName] = useState('');
    const [currency, setCurrency] = useState('UZS');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            setLoading(false);
            return;
        }

        const shopId = uuidv4();
        const newShop = {
            id: shopId,
            owner_id: user.id,
            name,
            currency,
            language: 'uz',
            created_at: new Date().toISOString()
        };

        // Save to Dexie (Offline First)
        await db.shops.add(newShop);

        // Save to Supabase (Best effort)
        const { error } = await supabase.from('shops').insert(newShop);

        if (error) {
            console.error('Supabase sync failed (expected if offline):', error);
            // Continue anyway because offline-first
        }

        setLoading(false);
        navigate('/'); // Go to dashboard
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
            <Card className="w-full max-w-md border-0 shadow-xl">
                <CardHeader>
                    <CardTitle>Create your Shop</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCreate} className="space-y-6">
                        <Input
                            placeholder="My Awesome Shop"
                            label="Shop Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
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
                            Start Selling
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
