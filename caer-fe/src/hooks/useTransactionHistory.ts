import { useCallback } from "react"

export function useTransactionHistory(userAddress: string) {
  // CREATE
  const createTransaction = useCallback(async (data: any) => {
    const res = await fetch("/api/transaction-history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return res.json()
  }, [])

  // READ
  const getTransactions = useCallback(async () => {
    const res = await fetch(`/api/transaction-history?user_address=${userAddress}`)
    return res.json()
  }, [userAddress])

  // UPDATE
  const updateTransaction = useCallback(async (id: string, update: any) => {
    const res = await fetch(`/api/transaction-history/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(update),
    })
    return res.json()
  }, [])

  return { createTransaction, getTransactions, updateTransaction }
}