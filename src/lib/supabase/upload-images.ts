import { supabase } from "@/lib/supabase/supabaseClient";

export async function uploadImage(file: File) {
  // 1️⃣ Очищаем имя файла
  const safeFileName = file.name
    .replace(/[^a-zA-Z0-9.\-_]/g, "_") // заменяем всё "небезопасное" на _
    .toLowerCase();

  // 2️⃣ Формируем путь в бакете
  const filePath = `tasks/${Date.now()}-${safeFileName}`;

  // 3️⃣ Загружаем
  const { error } = await supabase.storage
    .from("task-images")
    .upload(filePath, file, { cacheControl: "3600", upsert: false });

  if (error) throw new Error(`Failed to upload image: ${error.message}`);

  // 4️⃣ Возвращаем публичную ссылку
  const { data } = supabase.storage.from("task-images").getPublicUrl(filePath);
  return data.publicUrl;
}
