"use client";

import React, { useState, useEffect } from "react";
import { ArrowDownIcon } from "@heroicons/react/24/outline";
import { TOKEN_OPTIONS, TokenOption } from "@/constants/tokenOption";
import { useAccount } from "wagmi";
import { formatUnits, Address } from "viem";
import { usePositionBalance } from "@/hooks/useTokenBalance";
import { useSwapToken } from "@/hooks/useSwapToken";
import { useTokenPrice } from "@/hooks/useTokenPrice";
import { useReadLendingData } from "@/hooks/read/useReadLendingData";
import SelectPosition from "@/app/borrow/_components/position/selectPosition";
import {
  getAllLPFactoryData,
  getSelectedCollateralTokenByLPAddress,
} from "@/actions/GetLPFactory";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { getPositionByOwnerAndLpAddress } from "@/actions/GetPosition";

export default function SwapPanel() {
  const { address } = useAccount();
  const [fromToken, setFromToken] = useState<TokenOption>(TOKEN_OPTIONS[0]);
  const [toToken, setToToken] = useState<TokenOption>(TOKEN_OPTIONS[1]);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [slippage, setSlippage] = useState("0.5");
  const [isMounted, setIsMounted] = useState(false);
  const [positionAddress, setPositionAddress] = useState<string | undefined>(
    undefined
  );
  const [positionLength, setPositionLength] = useState(0);
  const [positionsArray, setPositionsArray] = useState<any[]>([]);
  const [lpAddress, setLpAddress] = useState<any[]>([]);
  const [lpAddressSelected, setLpAddressSelected] = useState<string>("");
  const [positionIndex, setPositionIndex] = useState<number | undefined>(
    undefined
  );
  const [selectedCollateralToken, setSelectedCollateralToken] =
    useState<any>(null);
  // Use our custom hooks
  const { balance: fromTokenBalance } = usePositionBalance(
    positionAddress as Address,
    fromToken.address as Address,
    fromToken.decimals
  );
  const { balance: toTokenBalance } = usePositionBalance(
    positionAddress as Address,
    toToken.address as Address,
    toToken.decimals
  );

  const { price } = useTokenPrice(
    fromToken.address as Address,
    toToken.address as Address
  );
  const { swapToken, isLoading, error, setError } = useSwapToken();

  const { dynamicUserCollateral } = useReadLendingData(
    undefined,
    undefined,
    lpAddressSelected as `0x${string}`
  );

  const arrayLocation = positionsArray.findIndex(
    (position) => position.positionAddress === positionAddress
  );

  // Set mounted state to true after hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchSelectedCollateralToken = async () => {
      const data = await getSelectedCollateralTokenByLPAddress(
        lpAddressSelected
      );
      console.log("data", data?.collateralToken);
      setSelectedCollateralToken(data?.collateralToken);
    };
    fetchSelectedCollateralToken();
  }, [lpAddressSelected]);

  // Calculate exchange rate and to amount
  useEffect(() => {
    if (fromAmount && price) {
      try {
        const amount = parseFloat(fromAmount);
        if (!isNaN(amount) && amount > 0) {
          const calculatedAmount = amount * price;
          setToAmount(calculatedAmount.toFixed(6));
        } else {
          setToAmount("");
        }
      } catch (err) {
        console.error("Error calculating exchange rate:", err);
        setToAmount("");
      }
    } else {
      setToAmount("");
    }
  }, [fromAmount, price, fromToken, toToken]);

  useEffect(() => {
    const fetchLpAddress = async () => {
      try {
        setPositionsArray([]);
        setPositionLength(0);
        setPositionAddress(undefined);
        const lpAddress = await getAllLPFactoryData();
        setLpAddress(lpAddress);
      } catch (error) {
        console.error("Error fetching LP address:", error);
        setLpAddress([]);
      }
    };
    fetchLpAddress();
  }, []);

  useEffect(() => {
    if (lpAddressSelected) {
      const fetchPosition = async () => {
        const response = await getPositionByOwnerAndLpAddress(
          address as string,
          lpAddressSelected
        );
        setPositionsArray(response.data);
        setPositionLength(response.data.length);
        setPositionAddress(undefined);
        console.log("response", response.data);
      };
      fetchPosition();
    }
  }, [lpAddressSelected]);

  // Swap positions of tokens
  const switchTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  // Handle token swap
  const handleSwap = async () => {
    console.log("toToken", toToken);
    const fromAmountReal = parseFloat(fromAmount) * 10 ** fromToken.decimals;
    const toAmountReal = parseFloat(toAmount) * 10 ** toToken.decimals;
    const fromTokenBalanceReal =
      fromToken.name === tokenName(selectedCollateralToken)
        ? Number(dynamicUserCollateral?.toString() ?? "0")
        : Number(fromTokenBalance) * 10 ** fromToken.decimals;
    console.log("fromAmount", fromAmountReal);
    console.log("toAmount", toAmountReal);
    if (!address) {
      setError("Please connect your wallet");
      return;
    }

    if (!fromAmountReal || fromAmountReal <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (fromAmountReal > Number(fromTokenBalanceReal)) {
      setError("Insufficient balance");
      return;
    }

    try {
      await swapToken({
        fromToken,
        toToken,
        fromAmount,
        toAmount,
        onSuccess: () => {
          // Reset form after successful swap
          setFromAmount("");
          setToAmount("");
        },
        onError: (error) => {
          console.error("Swap error:", error);
        },
        positionAddress: positionAddress as Address,
        arrayLocation: BigInt(arrayLocation),
        lpAddress: lpAddressSelected as Address,
      });
    } catch (err) {
      console.error("Swap error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to execute swap. Please try again."
      );
    }
  };

  // Determine button text based on client-side state only
  const getButtonText = () => {
    if (!isMounted) return "Swap"; // Default text for SSR
    if (!address) return "Connect Wallet";
    if (isLoading) return "Processing...";
    return "Swap";
  };

  const handlePositionAddressChange = (address: string) => {
    setPositionAddress(address as `0x${string}`);
  };

  const tokenName = (address: string) => {
    const token = TOKEN_OPTIONS.find((token) => token.address === address);
    return token?.name;
  };

  const tokenLogo = (address: string) => {
    const token = TOKEN_OPTIONS.find((token) => token.address === address);
    return token?.logo;
  };

  return (
    <div className="max-w-md mx-auto w-full px-4 py-2">
      <h2 className="text-2xl font-bold text-center text-[#07094d] mb-6">
        Swap Token
      </h2>
      <div className="flex flex-row gap-4 mb-5">
        <div className="w-full max-w-1/2">
          <Select onValueChange={(value) => setLpAddressSelected(value)}>
            <SelectTrigger className="truncate w-full bg-white text-gray-800 border border-gray-300 hover:border-gray-400 focus:ring-2 focus:ring-emerald-200 rounded-lg shadow-sm cursor-pointer">
              <SelectValue placeholder="Select LP Address" />
            </SelectTrigger>
            <SelectContent className="truncate bg-white border border-gray-300 rounded-lg shadow-md">
              <SelectGroup>
                <SelectLabel className="truncate text-gray-700 font-semibold px-3 pt-2">
                  Pool Address
                </SelectLabel>
                {address ? (
                  lpAddress.map((lp) => (
                    <SelectItem
                      key={lp.id}
                      value={lp.lpAddress}
                      className="truncate cursor-pointer px-3 pr-8 py-2 text-sm text-gray-800 hover:bg-emerald-50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Image
                          src={tokenLogo(lp.collateralToken) ?? ""}
                          alt={tokenName(lp.collateralToken) ?? ""}
                          className="w-5 h-5 rounded-full"
                          width={20}
                          height={20}
                        />
                        <span>{tokenName(lp.collateralToken)}</span>
                        <span>-</span>
                        <Image
                          src={tokenLogo(lp.borrowToken) ?? ""}
                          alt={tokenName(lp.borrowToken) ?? ""}
                          className="w-5 h-5 rounded-full"
                          width={20}
                          height={20}
                        />
                        <span>{tokenName(lp.borrowToken)}</span>
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <div className="text-gray-600 px-3 py-2 text-sm">
                    No LP Address found
                  </div>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full max-w-1/2">
          <SelectPosition
            positionAddress={positionAddress}
            positionArray={positionsArray}
            positionIndex={positionIndex}
            setPositionAddress={setPositionAddress}
            setPositionLength={setPositionLength}
            setPositionsArray={setPositionsArray}
            setPositionIndex={setPositionIndex}
          />
        </div>
      </div>

      <div className="space-y-4 w-full">
        {/* From Token */}
        <div className="bg-white border border-[#01ECBE]/30 rounded-xl p-4 w-full shadow-sm">
          <div className="flex justify-between mb-5">
            <label
              htmlFor="fromAmount"
              className="text-[#07094d]/80 font-medium"
            >
              From
            </label>
            <span className="text-[#07094d]/80 text-sm truncate">
              Balance:{" "}
              {fromToken.name === tokenName(selectedCollateralToken)
                ? formatUnits(
                    BigInt(dynamicUserCollateral?.toString() ?? "0"),
                    fromToken.decimals
                  )
                : fromTokenBalance}{" "}
              {fromToken.name}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              id="fromAmount"
              type="number"
              className="w-full bg-transparent text-[#07094d] text-xl focus:outline-none p-2 border-b border-[#01ECBE]/30"
              placeholder="0.0"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              aria-label="Amount to swap"
            />
            <select
              className="bg-[#141beb]/10 text-[#07094d] py-2 px-3 rounded-lg border border-[#141beb]/20"
              value={fromToken.address}
              onChange={(e) =>
                setFromToken(
                  TOKEN_OPTIONS.find((t) => t.address === e.target.value) ||
                    TOKEN_OPTIONS[0]
                )
              }
              aria-label="Select token to swap from"
            >
              {TOKEN_OPTIONS.map((token, index) => (
                <option key={index} value={token.address}>
                  {token.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Switch button */}
        <div className="flex justify-center">
          <button
            onClick={switchTokens}
            className="bg-white p-2 rounded-full hover:bg-[#01ECBE]/20 border border-[#01ECBE]/30 transition-colors z-10 cursor-pointer"
            aria-label="Switch tokens"
          >
            <ArrowDownIcon className="h-5 w-5 text-[#141beb]" />
          </button>
        </div>

        {/* To Token */}
        <div className="bg-white border border-[#01ECBE]/30 rounded-xl p-4 shadow-sm">
          <div className="flex justify-between mb-2">
            <label htmlFor="toAmount" className="text-[#07094d]/80 font-medium">
              To
            </label>
            <span className="text-[#07094d]/80 text-sm truncate">
              {/* Balance: {toTokenBalance} {toToken.name} */}
              Balance:{" "}
              {toToken.name === tokenName(selectedCollateralToken)
                ? formatUnits(
                    BigInt(dynamicUserCollateral?.toString() ?? "0"),
                    toToken.decimals
                  )
                : toTokenBalance}{" "}
              {toToken.name}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              id="toAmount"
              type="number"
              className="w-full bg-transparent text-[#07094d] text-xl focus:outline-none p-2 border-b border-[#01ECBE]/30"
              placeholder="0.0"
              value={toAmount}
              readOnly
              aria-label="Amount to receive"
            />
            <select
              className="bg-[#141beb]/10 text-[#07094d] py-2 px-3 rounded-lg border border-[#141beb]/20"
              value={toToken.address}
              onChange={(e) =>
                setToToken(
                  TOKEN_OPTIONS.find((t) => t.address === e.target.value) ||
                    TOKEN_OPTIONS[1]
                )
              }
              aria-label="Select token to receive"
            >
              {TOKEN_OPTIONS.map((token, index) => (
                <option key={index} value={token.address}>
                  {token.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Rate */}
        <div className="bg-white border border-[#01ECBE]/30 rounded-xl p-3 text-sm text-[#07094d]/80 shadow-sm">
          <div className="flex justify-between">
            <span>Exchange Rate:</span>
            <span className="truncate">
              {price
                ? `1 ${fromToken.name} ≈ ${price.toFixed(6)} ${toToken.name}`
                : "Loading..."}
            </span>
          </div>
        </div>

        {/* Slippage Setting */}
        <div className="bg-white border border-[#01ECBE]/30 rounded-xl p-3 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <span className="text-[#07094d]/80 font-medium">
              Slippage Tolerance
            </span>
            <div className="flex flex-wrap gap-1">
              {["0.5", "1", "2", "3"].map((value) => (
                <button
                  key={value}
                  className={`px-3 py-1 rounded text-sm ${
                    slippage === value
                      ? "bg-[#141beb] text-white"
                      : "bg-[#141beb]/10 text-[#07094d] hover:bg-[#141beb]/20 cursor-pointer"
                  }`}
                  onClick={() => setSlippage(value)}
                >
                  {value}%
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-sm bg-red-100 p-3 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        {/* Swap Button */}
        <button
          onClick={handleSwap}
          disabled={
            isLoading ||
            !fromAmount ||
            !toAmount ||
            !address ||
            positionAddress === undefined ||
            arrayLocation === -1
          }
          className={`w-full py-3.5 rounded-xl font-bold transition-colors ${
            isLoading ||
            !fromAmount ||
            !toAmount ||
            !address ||
            positionAddress === undefined ||
            arrayLocation === -1
              ? "bg-[#141beb]/30 text-white cursor-not-allowed"
              : "bg-[#141beb] text-white hover:bg-[#141beb]/90 cursor-pointer shadow-md hover:shadow-lg "
          }`}
        >
          {getButtonText()}
        </button>
      </div>
    </div>
  );
}
