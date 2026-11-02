import { createClient, SupabaseClient } from '@supabase/supabase-js';

const getEnvOrStorage = (envKey: string, storageKey: string): string => {
  const envVal = import.meta.env[envKey];
  if (envVal && !envVal.includes('your-project')) {
    return envVal;
  }
  try {
    const stored = localStorage.getItem(storageKey);
    return stored || '';
  } catch {
    return '';
  }
};

const supabaseUrl = getEnvOrStorage('VITE_SUPABASE_URL', 'snakeling_supabase_url');
const supabaseAnonKey = getEnvOrStorage('VITE_SUPABASE_ANON_KEY', 'snakeling_supabase_key');

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your-project')
);

// Active client or null
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const saveSupabaseCredentials = (url: string, key: string) => {
  localStorage.setItem('snakeling_supabase_url', url.trim());
  localStorage.setItem('snakeling_supabase_key', key.trim());
  window.location.reload();
};

export const clearSupabaseCredentials = () => {
  localStorage.removeItem('snakeling_supabase_url');
  localStorage.removeItem('snakeling_supabase_key');
  window.location.reload();
};

export const getSupabaseConfig = () => ({
  url: supabaseUrl,
  anonKey: supabaseAnonKey,
  isConfigured: isSupabaseConfigured
});
