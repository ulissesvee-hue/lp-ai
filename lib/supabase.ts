import { createClient } from "@supabase/supabase-js";

export const LOGO_BUCKET = "client-logos";
export const LOGO_MAX_BYTES = 2 * 1024 * 1024;
export const LOGO_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function ensureLogoBucket() {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase.storage.getBucket(LOGO_BUCKET);

  if (data) {
    return supabase;
  }

  const { error } = await supabase.storage.createBucket(LOGO_BUCKET, {
    public: true,
    allowedMimeTypes: LOGO_MIME_TYPES,
    fileSizeLimit: "2MB",
  });

  if (error && !error.message.toLowerCase().includes("already exists")) {
    throw error;
  }

  return supabase;
}
