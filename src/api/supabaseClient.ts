import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// 클라이언트 생성 및 내보내기
export const supabase = createClient(supabaseUrl, supabaseKey);
