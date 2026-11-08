import { createClient, SupabaseClient } from '@supabase/supabase-js';

interface ResolvedConfig {
  value: string;
  source: 'secret' | 'local_storage' | 'none';
}

const resolveConfigValue = (
  envKeys: string[],
  storageKey: string,
  isUrl: boolean
): ResolvedConfig => {
  // 1. First check environment variables (Secrets from AI Studio)
  for (const key of envKeys) {
    const envVal = (import.meta.env as Record<string, string | undefined>)[key];
    if (envVal && typeof envVal === 'string') {
      const clean = envVal.trim();
      if (clean && !clean.includes('your-project') && !clean.includes('snakeling8.supabase.co')) {
        if (!isUrl || (clean.startsWith('https://') && clean.includes('.supabase.co'))) {
          return { value: clean, source: 'secret' };
        }
      }
    }
  }

  // 2. Check localStorage fallback
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const clean = stored.trim();
      // Auto-purge invalid or placeholder URLs
      if (clean.includes('snakeling8.supabase.co') || clean.includes('your-project')) {
        localStorage.removeItem(storageKey);
        return { value: '', source: 'none' };
      }
      if (!isUrl || (clean.startsWith('https://') && clean.includes('.supabase.co'))) {
        return { value: clean, source: 'local_storage' };
      }
    }
  } catch {
    // Ignore storage access errors
  }

  return { value: '', source: 'none' };
};

const resolvedUrl = resolveConfigValue(
  ['VITE_SUPABASE_URL', 'SUPABASE_URL', 'SUPABASE_PROJECT_URL', 'NEXT_PUBLIC_SUPABASE_URL'],
  'snakeling_supabase_url',
  true
);

const resolvedKey = resolveConfigValue(
  ['VITE_SUPABASE_ANON_KEY', 'SUPABASE_ANON_KEY', 'SUPABASE_KEY', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'],
  'snakeling_supabase_key',
  false
);

export const supabaseUrl = resolvedUrl.value;
export const supabaseAnonKey = resolvedKey.value;
export const configSource = resolvedUrl.source === 'secret' || resolvedKey.source === 'secret'
  ? 'secret'
  : (resolvedUrl.source === 'local_storage' ? 'local_storage' : 'none');

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  supabaseUrl.includes('.supabase.co') &&
  !supabaseUrl.includes('snakeling8.supabase.co') &&
  !supabaseUrl.includes('your-project')
);

// Active client or null
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    })
  : null;

export const saveSupabaseCredentials = (url: string, key: string) => {
  const cleanUrl = url.trim();
  const cleanKey = key.trim();
  localStorage.setItem('snakeling_supabase_url', cleanUrl);
  localStorage.setItem('snakeling_supabase_key', cleanKey);
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
  isConfigured: isSupabaseConfigured,
  source: configSource
});
