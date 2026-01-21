import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { useCart } from './useCart';
import { ProductList } from './ProductList';
import { Input } from '@/components/ui/Input';
import { Search, Scan, X, Settings, FileText, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { PaymentModal } from './PaymentModal';
import { ReceiptPreview } from '@/features/receipt/ReceiptPreview';
import { useShop } from '@/context/ShopContext';
import { v4 as uuidv4 } from 'uuid';
import { Transaction, TransactionItem, Product } from '@/types';
import { useNavigate } from 'react-router-dom';

export default function PosPage() {
    const [search, setSearch] = useState('');
    const [showCart, setShowCart] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [lastTransaction, setLastTransaction] = useState<{ t: Transaction, i: TransactionItem[] } | null>(null);

    const { shop } = useShop();
    const navigate = useNavigate();

    const products = useLiveQuery(
        () => db.products
            .where('name').startsWithIgnoreCase(search)
            .or('barcode').equals(search)
            .toArray()
        , [search]);

    const { items, addToCart, removeFromCart, updateQuantity, clearCart, total } = useCart();

    const handlePaymentComplete = async (paymentType: 'cash' | 'card') => {
        if (!shop) return;

        const transactionId = uuidv4();
        const now = new Date();
        // YYYY-MM-DD
        const businessDate = now.toISOString().split('T')[0];

        const transaction: Transaction = {
            id: transactionId,
            shop_id: shop.id,
            business_date: businessDate,
            total: total,
            payment_type: paymentType,
            created_at: now.toISOString(),
            synced: false
        };

        const transactionItems: TransactionItem[] = items.map(item => ({
            id: uuidv4(),
            transaction_id: transactionId,
            product_name: item.product.name,
            price: item.product.price,
            quantity: item.quantity
        }));

        // 1. Save to DB
        await db.transaction('rw', db.transactions, db.transaction_items, async () => {
            await db.transactions.add(transaction);
            await db.transaction_items.bulkAdd(transactionItems);
        });

        // 2. Clear Cart & Close Payment Modal
        setShowPayment(false);
        clearCart();
        setShowCart(false);

        // 3. Show Receipt
        setLastTransaction({ t: transaction, i: transactionItems });
    };

    const handleNewSale = () => {
        setLastTransaction(null);
    };

    if (!shop) return <div>Loading Shop...</div>;

    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* Receipt Overlay */}
            {lastTransaction && (
                <ReceiptPreview
                    transaction={lastTransaction.t}
                    items={lastTransaction.i}
                    shop={shop}
                    onNewSale={handleNewSale}
                />
            )}

            {/* Top Bar */}
            <div className="p-4 bg-white sticky top-0 z-10 shadow-sm flex items-center space-x-2">
                <Button size="icon" variant="ghost" className="rounded-full" onClick={() => navigate('/settings')}>
                    <Settings className="h-6 w-6 text-gray-400" />
                </Button>
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                        className="pl-10 pr-10 h-11 rounded-2xl border-gray-100 bg-gray-50"
                        placeholder="Search or Scan..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Scan className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                </div>
                <Button size="icon" variant="ghost" className="rounded-full text-blue-600 bg-blue-50" onClick={() => navigate('/day-close')}>
                    <FileText className="h-6 w-6" />
                </Button>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-4">
                {products && products.length > 0 ? (
                    <ProductList products={products} onAdd={addToCart} />
                ) : (
                    <div className="text-center py-10">
                        <p className="text-gray-400 mb-4">No products found for "{search}"</p>
                        {search && (
                            <Button onClick={async () => {
                                const newProduct: Product = {
                                    id: uuidv4(),
                                    shop_id: shop.id,
                                    barcode: search,
                                    name: `Product ${search}`,
                                    price: 0
                                };

                                const name = prompt("Product Name:", search);
                                const priceStr = prompt("Price:", "0");
                                if (name && priceStr) {
                                    newProduct.name = name;
                                    newProduct.price = parseFloat(priceStr);
                                    await db.products.add(newProduct);
                                    addToCart(newProduct);
                                    setSearch('');
                                }
                            }}>
                                <div className="flex items-center">
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Add "{search}"
                                </div>
                            </Button>
                        )}
                    </div>
                )}
            </div>

            {/* Bottom Cart Bar */}
            {items.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-20 pb-8 safe-area-bottom">
                    <div className="flex items-center justify-between mb-0">
                        <div
                            className="flex items-center space-x-3 flex-1 cursor-pointer"
                            onClick={() => setShowCart(true)}
                        >
                            <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                                {items.reduce((s, i) => s + i.quantity, 0)}
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Total</p>
                                <p className="font-bold text-lg leading-none">{formatCurrency(total)}</p>
                            </div>
                        </div>
                        <Button size="lg" className="rounded-xl px-8" onClick={() => setShowPayment(true)}>
                            Charge
                        </Button>
                    </div>
                </div>
            )}

            {/* Cart Drawer */}
            {showCart && (
                <div className="fixed inset-0 z-50 bg-black/50 flex flex-col justify-end">
                    <div className="bg-white rounded-t-3xl h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">
                        <div className="p-4 border-b flex items-center justify-between">
                            <h2 className="text-xl font-bold">Current Sale</h2>
                            <Button variant="ghost" size="icon" onClick={() => setShowCart(false)}>
                                <X />
                            </Button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {items.map(item => (
                                <div key={item.product.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                                    <div>
                                        <p className="font-medium">{item.product.name}</p>
                                        <p className="text-blue-600 font-bold">{formatCurrency(item.product.price)}</p>
                                    </div>
                                    <div className="flex items-center space-x-3 bg-white rounded-lg p-1 shadow-sm">
                                        <button className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-100 rounded" onClick={() => updateQuantity(item.product.id, -1)}>-</button>
                                        <span className="font-bold w-4 text-center">{item.quantity}</span>
                                        <button className="w-8 h-8 flex items-center justify-center text-lg text-blue-600 hover:bg-blue-50 rounded" onClick={() => updateQuantity(item.product.id, 1)}>+</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t bg-gray-50 safe-area-bottom">
                            <div className="flex justify-between mb-4 text-lg font-bold">
                                <span>Total</span>
                                <span>{formatCurrency(total)}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <Button variant="outline" className="text-red-500 border-red-100 bg-red-50 hover:bg-red-100" onClick={clearCart}>
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Clear
                                </Button>
                                <Button size="lg" onClick={() => { setShowCart(false); setShowPayment(true); }}>
                                    Charge
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showPayment && (
                <PaymentModal
                    total={total}
                    onClose={() => setShowPayment(false)}
                    onComplete={handlePaymentComplete}
                />
            )}
        </div>
    );
}
