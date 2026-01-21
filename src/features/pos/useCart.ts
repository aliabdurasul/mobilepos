import { useState, useCallback } from 'react';
import { Product, CartItem } from '@/types';

export function useCart() {
    const [items, setItems] = useState<CartItem[]>([]);

    const addToCart = useCallback((product: Product) => {
        setItems(current => {
            const existing = current.find(item => item.product.id === product.id);
            if (existing) {
                return current.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...current, { product, quantity: 1 }];
        });
    }, []);

    const removeFromCart = useCallback((productId: string) => {
        setItems(current => current.filter(item => item.product.id !== productId));
    }, []);

    const updateQuantity = useCallback((productId: string, delta: number) => {
        setItems(current => {
            return current.map(item => {
                if (item.product.id === productId) {
                    const newQty = item.quantity + delta;
                    return newQty > 0 ? { ...item, quantity: newQty } : item;
                }
                return item;
            });
        });
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    return {
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total
    };
}
