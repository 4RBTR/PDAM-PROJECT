// lib/supabase.ts - Supabase client untuk Storage (server-side only)
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

// Service role client - untuk upload file dari server (bypass RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export const BUCKET_NAME = "Pdam";

// Helper: Upload file ke Supabase Storage, return public URL
export async function uploadToStorage(
  file: File | Blob,
  fileName: string,
  folder: string = "uploads"
): Promise<string> {
  const filePath = `${folder}/${fileName}`;

  const { error } = await supabaseAdmin.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) {
    throw new Error(`Upload gagal: ${error.message}`);
  }

  const { data: urlData } = supabaseAdmin.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}
