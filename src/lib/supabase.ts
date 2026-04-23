import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Database {
  public: {
    Tables: {
      protected_files: {
        Row: {
          id: string;
          name: string;
          size: number;
          password: string;
          file_data: string;
          user_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          size: number;
          password: string;
          file_data: string;
          user_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          size?: number;
          password?: string;
          file_data?: string;
          user_id?: string | null;
          created_at?: string;
        };
      };
    };
  };
}
