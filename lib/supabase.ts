// lib/supabase.ts - Supabase client untuk Storage (server-side only)
import { createClient } from "@supabase/supabase-js";

export const getSupabaseAdmin = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string || "https://placeholder.supabase.co";
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string || "placeholder_key";
    return createClient(supabaseUrl, supabaseServiceKey);
};

export const BUCKET_NAME = "Pdam";

// Helper: Upload file ke Supabase Storage, return public URL
export async function uploadToStorage(
  file: File | Blob,
  fileName: string,
  folder: string = "uploads"
): Promise<string> {
  const filePath = `${folder}/${fileName}`;

  const admin = getSupabaseAdmin();
  
  // Convert File/Blob to a buffer, which is much more reliable on Vercel/Node.js environments
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const fileType = file.type || 'image/jpeg';
  
  const { error } = await admin.storage
    .from(BUCKET_NAME)
    .upload(filePath, buffer, {
      cacheControl: "3600",
      upsert: true,
      contentType: fileType,
    });

  if (error) {
    throw new Error(`Upload gagal: ${error.message}`);
  }

  const { data: urlData } = admin.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}
