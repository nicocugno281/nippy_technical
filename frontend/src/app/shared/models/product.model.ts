export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    categories: string[];
    stock: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface SearchResult {
    items: Product[];
    total: number;
    page: number;
    limit: number;
}