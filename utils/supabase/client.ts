import { createBrowserClient } from "@supabase/ssr";
import '@/envConfig.ts'

export const createClient = () =>
  createBrowserClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
  );
