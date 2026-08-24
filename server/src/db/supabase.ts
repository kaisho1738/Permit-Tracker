import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from .env.local with fallback to .env
dotenv.config({ path: '.env.local' });
dotenv.config();

// Extract and sanitize Supabase base URL (removing trailing /rest/v1 or slashes if present)
const rawUrl = process.env.SUPABASE_URL || '';
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');

// Extract Supabase API key from server environment
const supabaseKey = process.env.SUPABASE_API || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('[Server] Warning: SUPABASE_URL or SUPABASE API key is missing in server environment variables.');
}

/**
 * Shared Supabase Client instance for backend database and auth operations.
 */
export const supabase = createClient(supabaseUrl, supabaseKey);

