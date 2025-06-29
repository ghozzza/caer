"use client";

import React, { useState, useEffect } from "react";
import { ArrowDownIcon } from "@heroicons/react/24/outline";
import { tokens } from "@/constants/token-address";
import { useAccount } from "wagmi";
import { formatUnits, Address } from "viem";
import { useBalance } from "@/hooks/useBalance";
import { useSwapToken } from "@/hooks/useSwapToken";
import { useTokenPrice } from "@/hooks/useTokenPrice";
import { useReadLendingData } from "@/hooks/read/useReadLendingData";
import { MoveRight, ShieldAlert, Wallet2 } from "lucide-react";
import { ArrowDownUp } from "lucide-react";
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
import { useReadUserCollateral } from "@/hooks/read/useReadUserCollateral";
import { useReadAddressPosition } from "@/hooks/read/useReadAddressPosition";
import Link from "next/link";
import { useReadPositionBalance } from "@/hooks/read/useReadPositionBalance";
import { toast } from "sonner";
import { useTokenCalculator } from "@/hooks/read/useTokenCalculator";

export default function SwapPanel() {
  const { address } = useAccount();
  const [fromToken, setFromToken] = useState(tokens[0]);
  const [toToken, setToToken] = useState(tokens[1]);
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
  // const { balance: fromTokenBalance } = useBalance(
  //   fromToken.addresses[43113] as Address,
  //   fromToken.decimals
  // );
  const { addressPosition } = useReadAddressPosition(lpAddressSelected);
  const { positionBalance: fromTokenBalance } = useReadPositionBalance(
    fromToken.addresses[43113] as Address,
    addressPosition as `0x${string}`
  );
  const { positionBalance: toTokenBalance } = useReadPositionBalance(
    toToken.addresses[43113] as Address,
    addressPosition as `0x${string}`
  );

  const {
    userCollateral,
    positionLoading,
    collateralLoading,
    positionError,
    collateralError,
  } = useReadUserCollateral(selectedCollateralToken, lpAddressSelected);

  // address position from hooks

  const {
    price: priceExchangeRate,
    isLoading: isLoadingPrice,
    error: errorPrice,
  } = useTokenCalculator(
    fromToken.addresses[43113] as Address,
    toToken.addresses[43113] as Address,
    Number(1),
    addressPosition as Address
  );

  const {
    price: priceExchangeRateReverse,
    isLoading: isLoadingPriceReverse,
    error: errorPriceReverse,
  } = useTokenCalculator(
    fromToken.addresses[43113] as Address,
    toToken.addresses[43113] as Address,
    Number(fromAmount),
    addressPosition as Address
  );

  const { swapToken, isLoading, error, setError } = useSwapToken({
    fromToken: {
      address: fromToken.addresses[43113] as Address,
      name: fromToken.name,
      decimals: fromToken.decimals,
    },
    toToken: {
      address: toToken.addresses[43113] as Address,
      name: toToken.name,
      decimals: toToken.decimals,
    },
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
    positionAddress: addressPosition as `0x${string}`,
    lpAddress: lpAddressSelected as Address,
  });

  // Set mounted state to true after hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchSelectedCollateralToken = async () => {
      const data = await getSelectedCollateralTokenByLPAddress(
        lpAddressSelected
      );
      setSelectedCollateralToken(data?.collateralToken);
    };
    fetchSelectedCollateralToken();
  }, [lpAddressSelected]);

  // Calculate exchange rate and to amount
  useEffect(() => {
    if (fromAmount && priceExchangeRate && priceExchangeRateReverse) {
      try {
        const amount = parseFloat(fromAmount);
        if (!isNaN(amount) && amount > 0) {
          const calculatedAmount = Number(priceExchangeRateReverse);
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
      setError("");
    }
  }, [
    fromAmount,
    priceExchangeRate,
    priceExchangeRateReverse,
    fromToken,
    toToken,
  ]);

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

  const formatExchangeRate = (price: number) => {
    return `1 ${fromToken.name} ≈ ${
      isLoadingPrice ? "Loading..." : Number(price).toFixed(6)
    } ${toToken.name}`;
  };

  // Handle token swap
  const handleSwap = async () => {
    const fromAmountReal = parseFloat(fromAmount) * 10 ** fromToken.decimals;
    const fromTokenBalanceReal =
      fromToken.name === tokenName(selectedCollateralToken)
        ? Number(userCollateral?.toString() ?? "0")
        : Number(fromTokenBalance) * 10 ** fromToken.decimals;
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
      await swapToken();
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

  const tokenName = (address: string) => {
    const token = tokens.find((token) => token.addresses[43113] === address);
    return token?.name;
  };

  const tokenLogo = (address: string) => {
    const token = tokens.find((token) => token.addresses[43113] === address);
    return token?.logo;
  };

  const formatBalance = (
    name: string,
    tokenAddress: string,
    decimals: number,
    tokenBalance: number
  ) => {
    return (
      <>
        {name === tokenName(tokenAddress)
          ? formatUnits(BigInt(tokenBalance.toString()), decimals)
          : tokenBalance}{" "}
        {name}
      </>
    );
  };

  const formatButtonClick = () => {
    if (
      addressPosition === "0x0000000000000000000000000000000000000000" ||
      addressPosition === undefined
    ) {
      toast.error("You don't have any active positions. Start by supplying collateral and borrowing assets.");
    } else if (
      Number(fromAmount) >
      Number(fromTokenBalance) / 10 ** fromToken.decimals
    ) {
      toast.error("Insufficient balance");
    } else {
      handleSwap();
    }
  };

  const formatButtonClassName = () => {
    return `w-full py-3.5 rounded-xl font-bold transition-colors ${
      isLoading ||
      !fromAmount ||
      !toAmount ||
      !address ||
      addressPosition === undefined ||
      addressPosition === "0x0000000000000000000000000000000000000000" ||
      Number(fromAmount) > Number(fromTokenBalance) / 10 ** fromToken.decimals
        ? "bg-blue-600/30 text-white shadow-md hover:shadow-lg cursor-not-allowed"
        : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer shadow-md hover:shadow-lg"
    }`;
  };

  return (
    <div className="max-w-md mx-auto w-full px-2 py-2">
      <div className="flex flex-row gap-2 mb-5">
        <div className="w-full max-w-[50%]">
          <Select onValueChange={(value) => setLpAddressSelected(value)}>
            <SelectTrigger className="truncate w-full bg-white text-blue-800 border border-blue-300 hover:border-blue-400 focus:ring-2 focus:ring-blue-200 rounded-lg shadow-sm cursor-pointer">
              <SelectValue placeholder="Select LP Address" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-blue-300 rounded-lg shadow-md max-w-[100%]">
              <SelectGroup>
                <SelectLabel className="text-blue-700 font-semibold px-3 pt-2 ">
                  Pool Address
                </SelectLabel>
                {address ? (
                  lpAddress.map((lp) => (
                    <SelectItem
                      key={lp.id}
                      value={lp.lpAddress}
                      className="py-2 px-0 text-sm text-blue-800 hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex flex-row gap-2 items-center justify-between">
                        <div className="flex items-center gap-2 truncate px-3">
                          <Image
                            src={tokenLogo(lp.collateralToken) ?? ""}
                            alt={tokenName(lp.collateralToken) ?? ""}
                            className="size-5 rounded-full text"
                            width={10}
                            height={10}
                          />
                          <span className="truncate">
                            {tokenName(lp.collateralToken)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 truncate">
                          <Image
                            src={tokenLogo(lp.borrowToken) ?? ""}
                            alt={tokenName(lp.borrowToken) ?? ""}
                            className="size-5 rounded-full"
                            width={10}
                            height={10}
                          />
                          <span className="truncate">
                            {tokenName(lp.borrowToken)}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <div className="text-blue-600 px-3 py-2 text-sm">
                    No LP Address found
                  </div>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div
          className={`w-full max-w-[50%] text-center px-3 py-1 rounded-lg ${
            addressPosition &&
            addressPosition !== "0x0000000000000000000000000000000000000000"
              ? "bg-blue-300 hover:bg-blue-400 duration-300 border-2 border-blue-400 cursor-pointer"
              : ""
          }`}
        >
          {addressPosition &&
          addressPosition !== "0x0000000000000000000000000000000000000000" ? (
            <Link
              className="flex flex-row gap-2 items-center justify-center text-blue-800 text-base text-center mt-0"
              href={`https://testnet.snowtrace.io/address/${addressPosition}`}
              target="_blank"
            >
              <Wallet2 className="size-5" />
              View Position
            </Link>
          ) : (
            <div className="text-blue-800 text-xl text-center flex flex-row gap-2 items-center justify-center">
              <ShieldAlert className="size-5" />
              No Position found
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4 w-full">
        {/* From Token */}
        <div className="bg-white border border-blue-300 rounded-xl p-4 w-full shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between mb-5">
            <label htmlFor="fromAmount" className="text-blue-800 font-medium">
              From
            </label>
            <span className="text-blue-700 text-sm truncate">
              Balance:{" "}
              {formatBalance(
                fromToken.name,
                fromToken.addresses[43113],
                fromToken.decimals,
                Number(fromTokenBalance ?? 0)
              )}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              id="fromAmount"
              type="text"
              className="w-full bg-transparent text-blue-900 text-xl focus:outline-none p-2 border-b border-blue-200"
              placeholder="0.0"
              value={fromAmount}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || /^\d*\.?\d*$/.test(value)) {
                  setFromAmount(value);
                }
              }}
              aria-label="Amount to swap"
            />
            <Select
              value={fromToken.addresses[43113]}
              onValueChange={(value) =>
                setFromToken(
                  tokens.find((t) => t.addresses[43113] === value) || tokens[0]
                )
              }
            >
              <SelectTrigger className="bg-blue-50 max-w-32 min-w-32 text-blue-800 py-2 px-3 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors cursor-pointer">
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent>
                {tokens.map((token, index) => (
                  <SelectItem
                    key={index}
                    value={token.addresses[43113]}
                    className="text-blue-800 flex flex-row gap-2 items-center cursor-pointer"
                  >
                    <Image
                      src={tokenLogo(token.addresses[43113]) ?? ""}
                      alt={token.name}
                      className="size-5 rounded-full"
                      width={10}
                      height={10}
                    />
                    {token.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Switch button */}
        <div className="flex justify-center">
          <div className="group">
            <button
              onClick={switchTokens}
              className="bg-white p-2 rounded-full hover:bg-blue-50 border border-blue-300 z-10 transform transition-transform duration-300 group-hover:rotate-18 cursor-pointer shadow-sm"
              aria-label="Switch tokens"
            >
              <ArrowDownUp className="h-5 w- text-blue-700  transform transition-transform duration-300 group-hover:rotate-162" />
            </button>
          </div>
        </div>

        {/* To Token */}
        <div className="bg-white border border-blue-300 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between mb-2">
            <label htmlFor="toAmount" className="text-blue-800 font-medium">
              To
            </label>
            <span className="text-blue-700 text-sm truncate">
              Balance:{" "}
              {formatBalance(
                toToken.name,
                toToken.addresses[43113],
                toToken.decimals,
                Number(toTokenBalance ?? 0)
              )}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              id="toAmount"
              type="number"
              className="w-full bg-transparent text-blue-900 text-xl focus:outline-none p-2 border-b border-blue-200"
              placeholder="0.0"
              value={toAmount}
              readOnly
              aria-label="Amount to receive"
            />
            <Select
              value={toToken.addresses[43113]}
              onValueChange={(value) =>
                setToToken(
                  tokens.find((t) => t.addresses[43113] === value) || tokens[0]
                )
              }
            >
              <SelectTrigger className="bg-blue-50 max-w-32 min-w-32 text-blue-800 py-2 px-3 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors cursor-pointer">
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent>
                {tokens.map((token, index) => (
                  <SelectItem
                    key={index}
                    value={token.addresses[43113]}
                    className="text-blue-800 flex flex-row gap-2 items-center cursor-pointer"
                  >
                    <Image
                      src={tokenLogo(token.addresses[43113]) ?? ""}
                      alt={token.name}
                      className="size-5 rounded-full"
                      width={10}
                      height={10}
                    />
                    {token.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Swap Rate */}
        <div className="bg-white border border-blue-300 rounded-xl p-3 text-sm text-blue-700 shadow-sm">
          <div className="flex justify-between">
            <span>Exchange Rate:</span>
            <span className="truncate">
              {formatExchangeRate(priceExchangeRate)}
            </span>
          </div>
        </div>

        {/* Slippage Setting */}
        <div className="bg-white border border-blue-300 rounded-xl p-3 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <span className="text-blue-800 font-medium">
              Slippage Tolerance
            </span>
            <div className="flex flex-wrap gap-1">
              {["0.5", "1", "2", "3"].map((value) => (
                <button
                  key={value}
                  className={`px-3 py-1 rounded text-sm ${
                    slippage === value
                      ? "bg-blue-600 text-white"
                      : "bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer"
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
          <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        {/* Swap Button */}
        <button onClick={formatButtonClick} className={formatButtonClassName()}>
          {getButtonText()}{" "}
        </button>
      </div>
    </div>
  );
}
