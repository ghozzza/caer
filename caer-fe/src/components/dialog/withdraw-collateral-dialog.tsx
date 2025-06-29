"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Wallet, ArrowUpRight, Loader2, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { formatUnits } from "viem"
import { useChainId } from "wagmi"
import { useReadUserCollateral } from "@/hooks/read/useReadUserCollateral"
import { useWithdrawCollateral } from "@/hooks/write/useWithdrawCollateral"
import { getTokenDecimals } from "@/lib/tokenUtils"
import { tokens } from "@/constants/token-address"

interface AmountInputProps {
  value: string
  onChange: (val: string) => void
  token: string
  label: string
  disabled: boolean
  lpAddress: string
  userCollateral?: bigint
  collateralLoading: boolean
  collateralError: any
}

const AmountInput = ({
  value,
  onChange,
  token,
  label,
  disabled,
  lpAddress,
  userCollateral,
  collateralLoading,
  collateralError,
}: AmountInputProps) => {
  const getDisplayValue = () => {
    if (collateralLoading) return "Loading..."
    if (collateralError) return "Error"
    if (userCollateral) {
      const etherValue = Number(userCollateral) / 1e18
      return etherValue.toFixed(2)
    }
    return "0.00"
  }

  const handleMaxClick = () => {
    if (userCollateral && !collateralLoading && !collateralError) {
      const etherValue = Number(userCollateral) / 1e18
      onChange(etherValue.toFixed(2))
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (
      val === "" ||
      val === "0" ||
      (val.startsWith("0.") && /^\d*\.?\d*$/.test(val)) ||
      (!val.startsWith("0") && /^\d*\.?\d*$/.test(val))
    ) {
      onChange(val)
    }
  }

  const isMaxDisabled = disabled || collateralLoading || !!collateralError || !userCollateral

  return (
    <Card className="border border-slate-200 bg-white shadow-sm">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-slate-700">{label}</h3>
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Withdraw
          </Badge>
        </div>

        <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
          <Input
            value={value}
            onChange={handleInputChange}
            type="text"
            inputMode="decimal"
            className="border-0 bg-transparent focus-visible:ring-0 text-lg font-medium"
            placeholder="0.00"
            disabled={disabled}
          />
          <div className="flex items-center gap-1 bg-slate-200 px-3 py-1 rounded-md">
            <Wallet className="h-4 w-4 text-slate-700" />
            <span className="font-semibold text-slate-700">{token.toUpperCase()}</span>
          </div>
        </div>

        <div className="mt-3 text-xs text-slate-500 flex items-center justify-between">
          <div>
            <span>Your Collateral: </span>
            <span className="font-medium">
              {getDisplayValue()} {token.toUpperCase()}
            </span>
          </div>
          <button
            className="text-xs p-1 text-purple-700 border border-purple-700 rounded-md hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            onClick={handleMaxClick}
            disabled={isMaxDisabled}
          >
            max
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

interface WithdrawCollateralProps {
  collateralToken: string
  lpAddress: string
  onSuccess?: () => void
}

const WithdrawCollateralDialog = ({ collateralToken, lpAddress, onSuccess }: WithdrawCollateralProps) => {
  const [amountInput, setAmountInput] = useState("")
  const [showSuccessState, setShowSuccessState] = useState(false)

  const chainId = useChainId()

  // Get collateral token address for chain 43113 (Avalanche Fuji)
  const collateralTokenAddress = tokens.find((t) => t.symbol === collateralToken)?.addresses[43113]

  const { userPostitionAddress, userCollateral, positionLoading, collateralLoading, positionError, collateralError } =
    useReadUserCollateral(collateralTokenAddress as string, lpAddress)

  const { withdraw, isWritePending, isReceiptLoading, isReceiptSuccess, txHash } = useWithdrawCollateral(lpAddress)

  const tokenDecimals = useMemo(() => getTokenDecimals(collateralToken, chainId) ?? 18, [collateralToken, chainId])

  const formattedBalance = useMemo(
    () => (userCollateral ? formatUnits(userCollateral, tokenDecimals) : null),
    [userCollateral, tokenDecimals],
  )

  const collateralBalanceNumber = useMemo(() => {
    const num = Number(formattedBalance)
    return isNaN(num) ? 0 : num
  }, [formattedBalance])

  // Consolidated display value function
  const getDisplayValue = () => {
    if (collateralLoading) return "Loading..."
    if (collateralError) return "Error"
    if (userCollateral) {
      return (Number(userCollateral) / 1e18).toFixed(2)
    }
    return "0.00"
  }

  const isDataLoading = positionLoading || collateralLoading
  const hasDataError = positionError || collateralError

  const isWithdrawDisabled =
    isWritePending ||
    isReceiptLoading ||
    isDataLoading ||
    !!hasDataError ||
    !userPostitionAddress ||
    !amountInput ||
    Number.parseFloat(amountInput) <= 0 ||
    Number.parseFloat(amountInput) > collateralBalanceNumber ||
    collateralBalanceNumber <= 0

  const handleWithdraw = () => {
    const parsed = Number.parseFloat(amountInput)

    if (parsed <= 0) {
      return toast.error("Amount must be greater than zero")
    }

    if (parsed > collateralBalanceNumber) {
      return toast.error("Amount exceeds available collateral")
    }

    if (!userPostitionAddress) {
      return toast.error("Position not found. Please create a position first.")
    }

    if (!lpAddress) {
      return toast.error("Lending pool address not available")
    }

    const amount = BigInt(Math.floor(parsed * 10 ** tokenDecimals))

    withdraw({
      amount,
      onBroadcast: () => {
        setAmountInput("")
        setShowSuccessState(true)
      },
    })
  }

  const handleClose = () => onSuccess?.()

  const handleNewWithdrawal = () => {
    setShowSuccessState(false)
    setAmountInput("")
  }

  const getButtonContent = () => {
    if (isWritePending || isReceiptLoading || isDataLoading) {
      return (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          {isWritePending ? "Pending in wallet..." : "Withdrawing..."}
        </>
      )
    }

    if (!userPostitionAddress) return "Create Position First"
    if (collateralBalanceNumber <= 0) return "No Collateral Available"
    if (!amountInput || Number.parseFloat(amountInput) <= 0) return "Enter Amount"

    return (
      <>
        <ArrowUpRight className="mr-2 h-5 w-5" />
        Withdraw {collateralToken}
      </>
    )
  }

  // Success State UI
  if (showSuccessState && isReceiptSuccess) {
    return (
      <>
        <div className="space-y-6 py-4">
          <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-center">
            <div className="bg-green-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Wallet className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">Withdrawal Successful!</h3>
            <p className="text-sm text-green-700 mb-4">
              Your {collateralToken} withdrawal has been confirmed on‑chain.
            </p>
            {txHash && (
              <div className="bg-white p-3 rounded border border-green-200">
                <p className="text-xs text-green-600 mb-1">Transaction Hash:</p>
                <a
                  href={`https://testnet.snowtrace.io/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-blue-600 hover:text-blue-800 underline break-all"
                >
                  {txHash}
                </a>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex gap-3">
          <Button
            onClick={handleNewWithdrawal}
            variant="outline"
            className="flex-1 h-12 text-base font-medium rounded-lg bg-transparent"
          >
            Make Another Withdrawal
          </Button>
          <Button
            onClick={handleClose}
            className="flex-1 h-12 text-base font-medium rounded-lg bg-gradient-to-r from-[#01ECBE] to-[#141beb] hover:from-[#141beb] hover:to-[#01ECBE] text-white shadow-md hover:shadow-lg transition-colors duration-300"
          >
            <X className="mr-2 h-5 w-5" />
            Close
          </Button>
        </DialogFooter>
      </>
    )
  }

  // Main Withdrawal UI
  return (
    <>
      <div className="space-y-6 py-4">
        <AmountInput
          value={amountInput}
          onChange={setAmountInput}
          token={collateralToken}
          label="Withdraw Amount"
          disabled={isWritePending || isReceiptLoading || isDataLoading}
          lpAddress={lpAddress}
          userCollateral={userCollateral}
          collateralLoading={collateralLoading}
          collateralError={collateralError}
        />

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <div className="flex items-start">
            <div className="bg-purple-100 p-1 rounded-full mr-3 shrink-0">
              <Wallet className="h-4 w-4 text-purple-600" />
            </div>
            <div className="w-full">
              <h4 className="text-sm font-medium text-purple-700 mb-3">Withdrawal Information</h4>

              {!isDataLoading && !hasDataError && (
                <div className="pt-2 border-t border-purple-200">
                  {collateralBalanceNumber <= 0 ? (
                    <p className="text-xs text-purple-600">
                      ⚠️ No collateral available to withdraw. Please supply collateral first.
                    </p>
                  ) : (
                    <>
                      <p className="text-xs text-purple-600 mb-2">
                        ⚠️ Withdrawing collateral may reduce your borrowing capacity. Make sure your position stays
                        healthy to avoid liquidation.
                      </p>
                      <p className="text-xs text-purple-600">
                        Available Collateral:{" "}
                        <span className="font-medium">
                          {getDisplayValue()} {collateralToken.toUpperCase()}
                        </span>
                      </p>
                    </>
                  )}

                  {txHash && !showSuccessState && (
                    <p className="text-xs mt-2">
                      Tx Hash:{" "}
                      <a
                        href={`https://testnet.snowtrace.io/tx/${txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-purple-800"
                      >
                        {txHash.slice(0, 10)}…
                      </a>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button
          onClick={handleWithdraw}
          disabled={isWithdrawDisabled}
          className={`w-full h-12 text-base font-medium rounded-lg transition-all duration-300 ${
            isWritePending || isReceiptLoading || isDataLoading
              ? "bg-slate-200 text-slate-500 cursor-not-allowed"
              : "bg-gradient-to-r from-[#01ECBE] to-[#141beb] hover:from-[#141beb] hover:to-[#01ECBE] text-white shadow-md hover:shadow-lg"
          }`}
        >
          {getButtonContent()}
        </Button>
      </DialogFooter>
    </>
  )
}

export default WithdrawCollateralDialog
