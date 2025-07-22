import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      hr_entries: {
        Row: {
          id: string;
          da_name: string;
          company_name: string;
          hr_name: string;
          hr_contact: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          da_name: string;
          company_name: string;
          hr_name: string;
          hr_contact: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          da_name?: string;
          company_name?: string;
          hr_name?: string;
          hr_contact?: string;
          created_at?: string;
        };
      };
      questions: {
        Row: {
          id: string;
          text: string;
          topic: string;
          asked_by: string;
          created_at: string;
          hr_entry_id: string | null; // <-- add this
        };
        Insert: {
          id?: string;
          text: string;
          topic: string;
          asked_by: string;
          created_at?: string;
          hr_entry_id?: string | null; // <-- add this
        };
        Update: {
          id?: string;
          text?: string;
          topic?: string;
          asked_by?: string;
          created_at?: string;
          hr_entry_id?: string | null; // <-- add this
        };
      };
      answers: {
        Row: {
          id: string;
          question_id: string;
          answer_text: string;
          answered_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          question_id: string;
          answer_text: string;
          answered_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          question_id?: string;
          answer_text?: string;
          answered_by?: string;
          created_at?: string;
        };
      };
      jobs: {
        Row: {
          id: string;
          da_name: string;
          phone_number: string | null;
          job_link: string;
          file_name: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          da_name: string;
          company_name: string;
          phone_number?: string | null;
          job_link: string;
          file_name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          da_name?: string;
          company_name?: string | null;
          phone_number?: string | null;
          job_link?: string;
          file_name?: string | null;
          created_at?: string;
        };
      };
    };
  };
};