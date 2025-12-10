import { createClient } from '@supabase/supabase-js';

// Helper function to safely access environment variables in different build environments
const getEnvVar = (key: string): string => {
  // Check import.meta.env (Vite standard) using 'any' cast to avoid TS errors if types aren't loaded
  if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env[key]) {
    return (import.meta as any).env[key];
  }
  // Check process.env (Node/Webpack standard)
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] || '';
  }
  return '';
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseAnonKey) {
  // Only warn in development or if truly missing in production logs
  console.warn('Supabase Credentials Missing. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);