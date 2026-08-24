import { supabase } from './db/supabase.js';

async function check() {
  const { data: userData, error: userError } = await supabase.from('users').select('*').limit(1);
  console.log('users columns:', userData?.[0] || userError);

  const { data: permitData, error: permitError } = await supabase.from('permits').select('*').limit(1);
  console.log('permits columns:', permitData?.[0] || permitError);
}

check();
