import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicConfig } from "./env";

export const createClient = () => {
  const { url, key } = getSupabasePublicConfig();

  return createBrowserClient(url, key);
};
