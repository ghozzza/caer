"use client"

import { useState } from "react"
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { poolAbi } from "@/lib/abis/poolAbi"
import { mockErc20Abi } from "@/lib/abis/mockErc20Abi"
import { tokens } from "@/constants/token-address"

const getTokenDecimals = (tokenAddress?: string): number => {
  if (!tokenAddress) return 6
  const token = tokens.find((token) =>
    Object.values(token.addresses).some((addr) => addr.toLowerCase() === tokenAddress.toLowerCase()),
  )
  return token?.decimals ?? 6
}

export const useSupplyCollateral = (borrowToken?: string, lpAddress?: string) => {
  const [error, setError] = useState<Error | null>(null)
  const { data: hash, isPending, writeContract, reset } = useWriteContract()
  const { isLoading, isSuccess, isError } = useWaitForTransactionReceipt({
    hash,
  })

  const supply = async (amount: string) => {
    setError(null)
    if (!lpAddress) {
      const error = new Error("Missing pool address")
      setError(error)
      return
    }

    if (!amount || isNaN(Number(amount))) {
      const error = new Error("Invalid supply amount")
      setError(error)
      return
    }

    const decimals = getTokenDecimals(borrowToken)
    const amountBigInt = BigInt(Math.floor(Number(amount) * 10 ** decimals))

    try {
      await writeContract({
        abi: poolAbi,
        address: lpAddress as `0x${string}`,
        functionName: "supplyCollateral",
        args: [amountBigInt],
      })
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Supply failed. Please try again.")
      setError(error)
    }
  }

  return {
    supply,
    hash,
    isPending,
    isLoading,
    isSuccess,
    isError,
    error,
    reset,
  }
}

export const useApproveCollateral = (
  tokenAddress?: string,
  spenderAddress?: string
) => {
  const [error, setError] = useState<Error | null>(null)
  const { data: hash, isPending, writeContract, reset } = useWriteContract()
  const { isLoading, isSuccess, isError } = useWaitForTransactionReceipt({
    hash,
  })

  const approve = async (amount: string) => {
    setError(null)
    if (!tokenAddress || !spenderAddress) {
      const error = new Error("Missing token or spender address")
      setError(error)
      return
    }

    if (!amount || isNaN(Number(amount))) {
      const error = new Error("Invalid approve amount")
      setError(error)
      return
    }

    const decimals = getTokenDecimals(tokenAddress)
    const amountBigInt = BigInt(Math.floor(Number(amount) * 10 ** decimals))

    try {
      await writeContract({
        abi: mockErc20Abi,
        address: tokenAddress as `0x${string}`,
        functionName: "approve",
        args: [spenderAddress as `0x${string}`, amountBigInt],
      })
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Approval failed. Please try again.")
      setError(error)
    }
  }

  return {
    approve,
    hash,
    isPending,
    isLoading,
    isSuccess,
    isError,
    error,
    reset,
  }
}
