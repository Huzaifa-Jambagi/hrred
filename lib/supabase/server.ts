// utils/supabase.ts
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

export function createSupabaseClient(token: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );
}

export async function SupabaseServerClient() {
  const { getToken } = await auth();
  const token = await getToken({ template: "supabase" });

  if (!token) throw new Error("No auth token");

  return createSupabaseClient(token);
}