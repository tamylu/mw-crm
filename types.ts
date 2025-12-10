
export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  APPOINTMENTS = 'APPOINTMENTS',
  PRODUCTS = 'PRODUCTS',
  SELLERS = 'SELLERS',
  CLIENTS = 'CLIENTS',
  PUBLIC_STORE = 'PUBLIC_STORE';
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
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
}

export interface ChartData {
  name: string;
  value: number;
}
