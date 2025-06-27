import { createClient } from "@supabase/supabase-js"

// Check if we're in a browser environment and have the required env vars
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string


// Create a mock client if env vars are not available (for demo purposes)
let supabase: any = null

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
  // Mock Supabase client for demo/development
  supabase = {
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: null, error: null }),
      update: () => ({ data: null, error: null }),
      eq: () => ({ data: [], error: null }),
      order: () => ({ data: [], error: null }),
    }),
    rpc: () => Promise.resolve({ data: null, error: null }),
    channel: () => ({
      on: () => ({ subscribe: () => {} }),
    }),
    removeChannel: () => {},
  }
}

export { supabase }

export type TransactionStatus = "pending" | "confirmed" | "failed" | "cancelled"

export interface BorrowTransaction {
  id: string
  user_address: string
  collateral_token: string
  collateral_chain: string
  collateral_amount?: string
  borrow_token: string
  borrow_chain: string
  borrow_amount: string
  gas_fee_estimate: string
  collateral_price: string
  borrow_price: string
  ltv_ratio: string
  status: TransactionStatus
  tx_hash?: string
  created_at: string
  updated_at: string
  error_message?: string
}
