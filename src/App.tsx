import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { db } from '@/lib/db';
import Login from '@/features/auth/Login';
import CreateShop from '@/features/auth/CreateShop';
import PosPage from '@/features/pos/PosPage';
import ReceiptPage from '@/features/receipt/ReceiptPage';
import DayClose from '@/features/reports/DayClose';
import SettingsPage from '@/features/settings/SettingsPage';
import { ShopProvider } from '@/context/ShopContext';
import { Loader2 } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';

function ProtectedRoute() {
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState<any>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) {
        return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;
    }

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

function ShopGuard() {
    // Check if shop exists in local DB
    const shops = useLiveQuery(() => db.shops.toArray());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app we might sync here or trust dexie
        const t = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(t);
    }, [shops]);

    if (loading && !shops) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

    if (shops && shops.length === 0) {
        return <Navigate to="/create-shop" replace />;
    }

    return <Outlet />;
}

function App() {
    return (
        <BrowserRouter>
            <ShopProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/receipt" element={<ReceiptPage />} />
                    <Route element={<ProtectedRoute />}>
                        <Route path="/create-shop" element={<CreateShop />} />
                        <Route element={<ShopGuard />}>
                            <Route path="/" element={<PosPage />} />
                            <Route path="/day-close" element={<DayClose />} />
                            <Route path="/settings" element={<SettingsPage />} />
                        </Route>
                    </Route>
                </Routes>
            </ShopProvider>
        </BrowserRouter>
    );
}

export default App;
