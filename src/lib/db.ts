import Dexie, { Table } from 'dexie';
import { Shop, Product, Transaction, TransactionItem, DailyReport } from '../types';

export class PrestigeDatabase extends Dexie {
    shops!: Table<Shop>;
    products!: Table<Product>;
    transactions!: Table<Transaction>;
    transaction_items!: Table<TransactionItem>;
    daily_reports!: Table<DailyReport>;

    constructor() {
        super('PrestigePOS');
        this.version(1).stores({
            shops: '++id, owner_id', // Primary key and indexes
            products: 'id, shop_id, barcode',
            transactions: 'id, shop_id, business_date, payment_type, synced',
            transaction_items: 'id, transaction_id',
            daily_reports: 'id, shop_id, business_date, synced'
        });
    }
}

export const db = new PrestigeDatabase();
