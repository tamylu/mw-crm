
export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  APPOINTMENTS = 'APPOINTMENTS',
  PRODUCTS = 'PRODUCTS',
  SELLERS = 'SELLERS',
  CLIENTS = 'CLIENTS',
  SALES = 'SALES',
  PUBLIC_STORE = 'PUBLIC_STORE'
}

export interface Appointment {
  id: string;
  clientName: string;
  date: string; // ISO Date string
  time: string;
  service: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  sellerId?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  images: string[]; // Base64 strings or URLs
  stock: number;
}

export interface Seller {
  id: string;
  name: string;
  email: string;
  phone: string;
  active: boolean;
  password?: string; // Added for authentication
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
}

export interface Sale {
  id: string;
  productId: string;
  clientId: string;
  sellerId: string;
  date: string; // ISO Date
  paymentMethod: 'Efectivo' | 'Tarjeta Crédito' | 'Tarjeta Débito' | 'Transferencia' | 'Otro';
  salePrice: number;
  extraCosts: number;
  total: number;
  notes?: string;
}

export interface ChartData {
  name: string;
  value: number;
}
