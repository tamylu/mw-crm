import { Appointment, Product, Seller, Client, Sale } from '../types';
import { supabase } from '../supabaseClient';

// --- SESSION MANAGEMENT ---

const SESSION_KEY = 'mw_session';
const SESSION_DURATION = 2 * 60 * 60 * 1000; // 2 Hours in milliseconds

export const saveSession = (user: Seller) => {
  const sessionData = {
    user,
    expiry: Date.now() + SESSION_DURATION
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
};

export const getSession = (): Seller | null => {
  const sessionStr = localStorage.getItem(SESSION_KEY);
  if (!sessionStr) return null;

  try {
    const session = JSON.parse(sessionStr);
    if (Date.now() > session.expiry) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session.user;
  } catch (e) {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
};

export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};

// --- AUTH ---

export const loginSeller = async (email: string, password: string): Promise<Seller | null> => {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) {
    console.error('Login failed:', authError);
    if (authError.message.includes('Failed to fetch')) {
      throw new Error('network error');
    }
    return null;
  }
  if (!authData.user) {
    return null;
  }

  const { data, error } = await supabase
    .from('sellers')
    .select('*')
    .eq('id', authData.user.id)
    .eq('active', true)
    .single();

  if (error || !data) {
    console.error('Could not find active seller profile:', error);
    // Also sign out the user from Supabase auth if their profile is not active
    await supabase.auth.signOut();
    clearSession();
    return null;
  }

  const user = data as Seller;
  saveSession(user);
  return user;
};

// --- SALES ---

export const fetchSales = async (): Promise<Sale[]> => {
  const { data, error } = await supabase.from('sales').select('*');
  if (error) {
    console.error('Error fetching sales:', error);
    return [];
  }
  
  return data.map((item: any) => ({
    id: item.id,
    productId: item.product_id,
    clientId: item.client_id,
    sellerId: item.seller_id,
    date: item.date,
    paymentMethod: item.payment_method,
    salePrice: item.sale_price,
    extraCosts: item.extra_costs,
    total: item.total,
    notes: item.notes
  }));
};

export const createSale = async (sale: Omit<Sale, 'id'>): Promise<Sale | null> => {
  const { data, error } = await supabase
    .from('sales')
    .insert([{
      product_id: sale.productId,
      client_id: sale.clientId,
      seller_id: sale.sellerId,
      date: sale.date,
      payment_method: sale.paymentMethod,
      sale_price: sale.salePrice,
      extra_costs: sale.extraCosts,
      total: sale.total,
      notes: sale.notes
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating sale:', error);
    return null;
  }

  return {
    id: data.id,
    productId: data.product_id,
    clientId: data.client_id,
    sellerId: data.seller_id,
    date: data.date,
    paymentMethod: data.payment_method,
    salePrice: data.sale_price,
    extraCosts: data.extra_costs,
    total: data.total,
    notes: data.notes
  };
};

export const deleteSale = async (id: string) => {
  const { error } = await supabase.from('sales').delete().eq('id', id);
  if (error) console.error('Error deleting sale:', error);
};

// --- APPOINTMENTS ---

export const fetchAppointments = async (): Promise<Appointment[]> => {
  const { data, error } = await supabase
    .from('appointments')
    .select('*');
  
  if (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }

  // Map snake_case DB columns to camelCase JS objects
  return data.map((item: any) => ({
    id: item.id,
    clientName: item.client_name,
    date: item.date,
    time: item.time,
    service: item.service,
    status: item.status,
    notes: item.notes,
    sellerId: item.seller_id
  }));
};

export const createAppointment = async (appt: Omit<Appointment, 'id'>): Promise<Appointment | null> => {
  const { data, error } = await supabase
    .from('appointments')
    .insert([{
      client_name: appt.clientName,
      date: appt.date,
      time: appt.time,
      service: appt.service,
      status: appt.status,
      notes: appt.notes,
      seller_id: appt.sellerId || null // Send null if empty string
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating appointment:', error);
    return null;
  }

  return {
    id: data.id,
    clientName: data.client_name,
    date: data.date,
    time: data.time,
    service: data.service,
    status: data.status,
    notes: data.notes,
    sellerId: data.seller_id
  };
};

export const updateAppointmentStatus = async (id: string, status: Appointment['status']) => {
  const { error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', id);
    
  if (error) console.error('Error updating appointment:', error);
};

export const deleteAppointment = async (id: string) => {
  const { error } = await supabase
    .from('appointments')
    .delete()
    .eq('id', id);

  if (error) console.error('Error deleting appointment:', error);
};

// --- PRODUCTS ---

export const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*');

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data.map((item: any) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    category: item.category,
    description: item.description,
    images: item.images || [],
    stock: item.stock
  }));
};

export const createProduct = async (prod: Omit<Product, 'id'>): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .insert([{
      name: prod.name,
      price: prod.price,
      category: prod.category,
      description: prod.description,
      images: prod.images,
      stock: prod.stock
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating product:', error);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    price: data.price,
    category: data.category,
    description: data.description,
    images: data.images || [],
    stock: data.stock
  };
};

export const deleteProduct = async (id: string) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) console.error('Error deleting product:', error);
};

// --- SELLERS ---

export const fetchSellers = async (): Promise<Seller[]> => {
  const { data, error } = await supabase.from('sellers').select('*');
  if (error) {
    console.error('Error fetching sellers:', error);
    return [];
  }
  return data as Seller[]; // Column names match assuming simple table
};

export const createSeller = async (seller: Omit<Seller, 'id'>): Promise<Seller | null> => {
  const { data, error } = await supabase
    .from('sellers')
    .insert([seller])
    .select()
    .single();

  if (error) {
    console.error('Error creating seller:', error);
    return null;
  }
  return data as Seller;
};

export const updateSeller = async (id: string, updates: Partial<Seller>): Promise<Seller | null> => {
  const { data, error } = await supabase
    .from('sellers')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating seller:', error);
    return null;
  }
  return data as Seller;
};

export const deleteSeller = async (id: string) => {
  const { error } = await supabase.from('sellers').delete().eq('id', id);
  if (error) console.error('Error deleting seller:', error);
};

// --- CLIENTS ---

export const fetchClients = async (): Promise<Client[]> => {
  const { data, error } = await supabase.from('clients').select('*');
  if (error) {
    console.error('Error fetching clients:', error);
    return [];
  }
  return data as Client[];
};

export const createClient = async (client: Omit<Client, 'id'>): Promise<Client | null> => {
  const { data, error } = await supabase
    .from('clients')
    .insert([client])
    .select()
    .single();

  if (error) {
    console.error('Error creating client:', error);
    return null;
  }
  return data as Client;
};

export const deleteClient = async (id: string) => {
  const { error } = await supabase.from('clients').delete().eq('id', id);
  if (error) console.error('Error deleting client:', error);
};
