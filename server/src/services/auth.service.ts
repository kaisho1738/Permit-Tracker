import { AuthRepository } from '../repositories/auth.repository.js';

export class AuthService {
  /**
   * Registers a user and creates their profile.
   */
  static async register(email: string, password: string) {
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }

    // 1. Sign up user via AuthRepository
    const { data, error } = await AuthRepository.signUpUser(email, password);
    if (error) {
      throw error;
    }

    // 2. Create public profile if user created
    if (data.user) {
      const { error: profileError } = await AuthRepository.createUserProfile(data.user.id, email);
      if (profileError) {
        console.error('[AuthService] Error creating public user profile:', profileError);
      }
    }

    return data;
  }

  /**
   * Logs in a user.
   */
  static async login(email: string, password: string) {
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }

    const { data, error } = await AuthRepository.signInUser(email, password);
    if (error) {
      throw error;
    }

    return data;
  }
}
