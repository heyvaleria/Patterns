import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import 'react-native-url-polyfill/auto'
import { Database } from '../types/database'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
// The ! tells TypeScript "I know this exists, trust me"
// We'll make this safer once we add proper env validation

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

// generics: The angle brackets <T> are the syntax
// "any" says "I don't know and I don't care — allow everything."
// "T" says "I don't know yet, but once I find out, I'll enforce it strictly."
