import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useNavigate } from 'react-router-dom';
import { Store } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
        } else {
            // Check if user has a shop
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                // TODO: Check shop existence logic here or in a protected route
                // For now, assume good and navigate
                navigate('/');
            }
        }
        setLoading(false);
    };

    const handleSignUp = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signUp({
            email,
            password
        });
        if (error) setError(error.message);
        else setError('Check your email for confirmation link (if enabled) or just sign in now.');
        setLoading(false);
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
            <Card className="w-full max-w-md border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <Store className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle>Prestige POS</CardTitle>
                    <p className="text-sm text-muted-foreground text-gray-500">
                        Sign in to manage your shop
                    </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <Input
                            type="email"
                            placeholder="name@example.com"
                            label="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            type="password"
                            placeholder="••••••••"
                            label="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        {error && (
                            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full" size="lg" isLoading={loading}>
                            Sign In
                        </Button>
                        <Button type="button" variant="outline" className="w-full" onClick={handleSignUp} disabled={loading}>
                            Create Account
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
