"use client"

import { useState, useEffect } from "react"
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { poolAbi } from "@/lib/abis/poolAbi"
import { mockErc20Abi } from "@/lib/abis/mockErc20Abi"
import { chains } from "@/constants/chain-address"
import { tokens } from "@/constants/token-address"

const getTokenDecimals = (tokenAddress?: string): number => {
  if (!tokenAddress) return 6
  const token = tokens.find((token) =>
    Object.values(token.addresses).some((addr) => addr.toLowerCase() === tokenAddress.toLowerCase()),
  )
  return token?.decimals ?? 6
}

const getLendingPoolAddress = (chainId: number): `0x${string}` | undefined => {
  const chain = chains.find((c) => c.id === chainId)
  return chain?.contracts.lendingPool as `0x${string}` | undefined
}

export const useSupplyCollateral = (chainId: number, borrowToken?: string) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState<"idle" | "approving" | "supplying" | "success">("idle")
  const [pendingAmount, setPendingAmount] = useState<string>("")

  const decimals = getTokenDecimals(borrowToken)
  const lendingPool = getLendingPoolAddress(chainId)

  const { data: approveHash, isPending: isApprovePending, writeContract: approveTransaction } = useWriteContract()

  const { data: supplyHash, isPending: isSupplyPending, writeContract: supplyTransaction } = useWriteContract()

  const { isLoading: isApproveLoading, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({
    hash: approveHash,
  })

  const { isLoading: isSupplyLoading, isSuccess } = useWaitForTransactionReceipt({
    hash: supplyHash,
  })

  const calculateBigIntAmount = (amount: string) => {
    return BigInt(Math.floor(Number(amount) * 10 ** decimals))
  }

  // Handle approval success - automatically trigger supply
  useEffect(() => {
    const handleApprovalSuccess = async () => {
      if (isApproveSuccess && currentStep === "approving" && pendingAmount) {
        try {
          setCurrentStep("supplying")
          console.log("🚀 Approval successful, sending supply transaction...")

          const supplyAmountBigInt = calculateBigIntAmount(pendingAmount)

          await supplyTransaction({
            abi: poolAbi,
            address: lendingPool!,
            functionName: "supplyCollateral",
            args: [supplyAmountBigInt],
          })

          console.log("✅ Supply transaction sent!")
        } catch (err) {
          console.error("❌ Supply failed:", err)
          setError("Supply transaction failed. Please try again.")
          setCurrentStep("idle")
          setIsProcessing(false)
          setPendingAmount("")
        }
      }
    }

    handleApprovalSuccess()
  }, [isApproveSuccess, currentStep, pendingAmount, lendingPool, supplyTransaction])

  // Handle supply success
  useEffect(() => {
    if (isSuccess && currentStep === "supplying") {
      setCurrentStep("success")
      setIsProcessing(false)
      setPendingAmount("")
      console.log("🎉 Supply completed successfully!")
    }
  }, [isSuccess, currentStep])

  const supply = async (amount: string) => {
    setIsProcessing(true)
    setError(null)
    setCurrentStep("approving")
    setPendingAmount(amount)

    if (!amount || isNaN(Number(amount))) {
      setError("Invalid supply amount")
      setIsProcessing(false)
      setCurrentStep("idle")
      setPendingAmount("")
      return
    }

    if (!lendingPool || !borrowToken) {
      setError("Missing token or pool address")
      setIsProcessing(false)
      setCurrentStep("idle")
      setPendingAmount("")
      return
    }

    const supplyAmountBigInt = calculateBigIntAmount(amount)

    try {
      console.log("⏳ Sending approval transaction...")

      await approveTransaction({
        abi: mockErc20Abi,
        address: borrowToken as `0x${string}`,
        functionName: "approve",
        args: [lendingPool, supplyAmountBigInt],
      })

      console.log("✅ Approval transaction sent!")
    } catch (err) {
      console.error("❌ Approval failed:", err)
      setError("Approval transaction failed. Please try again.")
      setIsProcessing(false)
      setCurrentStep("idle")
      setPendingAmount("")
    }
  }

  return {
    supply,
    isApprovePending,
    isSupplyPending,
    isApproveLoading,
    isSupplyLoading,
    isProcessing,
    error,
    isSuccess,
    approveHash,
    supplyHash,
    currentStep,
    isApproveSuccess,
  }
}
