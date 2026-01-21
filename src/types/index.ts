export interface Shop {
    id: string; // UUID from Supabase
    owner_id: string;
    name: string;
    currency: string;
    language: string;
    created_at: string;
}

export interface Product {
    id: string;
    shop_id: string;
    barcode: string;
    name: string;
    price: number;
    // created_at?
}

export type PaymentType = 'cash' | 'card';

export interface Transaction {
    id: string;
    shop_id: string;
    business_date: string; // YYYY-MM-DD
    total: number;
    payment_type: PaymentType;
    created_at: string;
    synced?: boolean; // Dexie internal
}

export interface TransactionItem {
    id: string;
    transaction_id: string;
    product_name: string;
    price: number;
    quantity: number;
}

export interface DailyReport {
    id: string;
    shop_id: string;
    business_date: string;
    total_sales: number;
    cash_total: number;
    card_total: number;
    transaction_count: number;
    closed_at: string;
    synced?: boolean;
}

export interface CartItem {
    product: Product;
    quantity: number;
}
