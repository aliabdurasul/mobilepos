import React from 'react';
import { Product } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import { Plus } from 'lucide-react';

interface ProductListProps {
    products: Product[];
    onAdd: (product: Product) => void;
}

export function ProductList({ products, onAdd }: ProductListProps) {
    return (
        <div className="grid grid-cols-2 gap-3 pb-24">
            {products.map((product) => (
                <Card
                    key={product.id}
                    className="overflow-hidden active:scale-95 transition-transform duration-100 cursor-pointer border-0 shadow-sm bg-white"
                    onClick={() => onAdd(product)}
                >
                    <div className="h-24 bg-gray-100 flex items-center justify-center text-gray-400">
                        {/* Placeholder for Product Image */}
                        <div className="text-3xl font-bold opacity-20">{product.name[0]}</div>
                    </div>
                    <CardContent className="p-3">
                        <h3 className="font-medium truncate">{product.name}</h3>
                        <div className="flex justify-between items-center mt-1">
                            <p className="text-blue-600 font-bold">{formatCurrency(product.price)}</p>
                            <div className="w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                <Plus size={14} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
