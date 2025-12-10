import { Appointment, Product, Seller, Client } from '../types';
import { supabase } from '../supabaseClient';

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


// --- UTILS ---

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIMENSION = 800;
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > MAX_DIMENSION) {
            height *= MAX_DIMENSION / width;
            width = MAX_DIMENSION;
          }
        } else {
          if (height > MAX_DIMENSION) {
            width *= MAX_DIMENSION / height;
            height = MAX_DIMENSION;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
            reject(new Error("Could not get canvas context"));
            return;
        }

        // Draw image on canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Export as JPEG with 0.7 quality to reduce size
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        resolve(dataUrl);
      };
      img.onerror = (error) => reject(error);
      
      if (event.target?.result) {
          img.src = event.target.result as string;
      } else {
          reject(new Error("File reading failed"));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};