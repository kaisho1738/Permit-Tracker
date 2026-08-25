import { supabase } from '../db/supabase.js';

export class AuthRepository {
  /**
   * Creates a user in Supabase Auth with auto-confirmation.
   */
  static async signUpUser(email: string, password: string) {
    const adminRes = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (!adminRes.error && adminRes.data?.user) {
      // Log in immediately to obtain active session tokens for client
      const loginRes = await supabase.auth.signInWithPassword({ email, password });
      if (loginRes.data?.session) {
        return loginRes;
      }
      return adminRes;
    }

    // Fallback to standard signUp
    return supabase.auth.signUp({
      email,
      password,
    });
  }

  /**
   * Inserts a user profile into the public.users table (user_id, email).
   */
  static async createUserProfile(userId: string, email: string) {
    return supabase.from('users').upsert([
      { user_id: userId, email }
    ], { onConflict: 'user_id' });
  }

  /**
   * Signs in a user using email and password.
   */
  static async signInUser(email: string, password: string) {
    return supabase.auth.signInWithPassword({
      email,
      password,
    });
  }

  /**
   * Deletes a user from Supabase Auth and cleans up associated records.
   */
  static async deleteUser(userId: string) {
    await supabase.from('permits').delete().eq('user_id', userId);
    await supabase.from('users').delete().eq('user_id', userId);
    const { data, error } = await supabase.auth.admin.deleteUser(userId);
    if (error) {
      throw error;
    }
    return data;
  }
}

