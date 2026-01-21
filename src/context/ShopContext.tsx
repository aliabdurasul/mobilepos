import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '@/lib/db';
import { Shop } from '@/types';
import { useLiveQuery } from 'dexie-react-hooks';

interface ShopContextType {
    shop: Shop | null;
    loading: boolean;
}

const ShopContext = createContext<ShopContextType>({ shop: null, loading: true });

export function ShopProvider({ children }: { children: React.ReactNode }) {
    const shops = useLiveQuery(() => db.shops.toArray());
    const [shop, setShop] = useState<Shop | null>(null);

    useEffect(() => {
        if (shops && shops.length > 0) {
            setShop(shops[0]); // Single shop per device for now
        }
    }, [shops]);

    return (
        <ShopContext.Provider value={{ shop, loading: !shops }}>
            {children}
        </ShopContext.Provider>
    );
}

export const useShop = () => useContext(ShopContext);
