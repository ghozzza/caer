"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useReadAddressPosition } from "@/hooks/read/useReadAddressPosition";
import { useReadPositionBalance } from "@/hooks/read/useReadPositionBalance";
import { useReadTotalBorrowShares } from "@/hooks/read/useReadTotalBorrowShares";
import { useReadUserBorrowShares } from "@/hooks/read/useReadUserBorrowShares";
import { useReadUserCollateral } from "@/hooks/read/useReadUserCollateral";
import { lendingPool, mockWeth, mockWbtc, mockUsdc, mockUsdt } from "@/constants/addresses";
import { formatEther, formatUnits } from "viem";

const tokens = [
  { symbol: "WETH", address: mockWeth, decimals: 18 },
  { symbol: "WBTC", address: mockWbtc, decimals: 8 },
  { symbol: "USDC", address: mockUsdc, decimals: 6 },
  { symbol: "USDT", address: mockUsdt, decimals: 6 },
];

export default function CobaPage() {
  const { address, isConnected } = useAccount();
  const [selectedToken, setSelectedToken] = useState<`0x${string}`>(mockWeth);

  // Read hooks
  const {
    addressPosition,
    isLoadingAddressPosition,
    refetchAddressPosition,
  } = useReadAddressPosition(lendingPool);

  const {
    positionBalance,
    isLoadingPositionBalance,
    refetchPositionBalance,
  } = useReadPositionBalance(selectedToken, addressPosition || "0x");

  const {
    totalBorrowShares,
    isLoadingTotalBorrowShares,
    refetchTotalBorrowShares,
  } = useReadTotalBorrowShares(lendingPool);

  const {
    userBorrowShares,
    isLoadingUserBorrowShares,
    refetchUserBorrowShares,
  } = useReadUserBorrowShares(lendingPool);

  const {
    userPostitionAddress,
    userCollateral,
    positionLoading,
    collateralLoading,
  } = useReadUserCollateral(selectedToken, lendingPool);

  const formatValue = (value: bigint | undefined, decimals: number) => {
    if (!value) return "0";
    try {
      return formatUnits(value, decimals);
    } catch {
      return "0";
    }
  };

  const handleRefresh = () => {
    refetchAddressPosition();
    refetchPositionBalance();
    refetchTotalBorrowShares();
    refetchUserBorrowShares();
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Wallet Connection Required</CardTitle>
            <CardDescription>
              Please connect your wallet to view position data.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Position Data Dashboard</h1>
        <Button onClick={handleRefresh} variant="outline">
          Refresh Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* LP Address */}
        <Card>
          <CardHeader>
            <CardTitle>LP Address</CardTitle>
            <CardDescription>Lending Pool contract address</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm font-mono bg-muted p-2 rounded">
                {lendingPool}
              </div>
              <div className="text-xs text-muted-foreground">
                Chain ID: 8453 (Base)
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Position */}
        <Card>
          <CardHeader>
            <CardTitle>Address Position</CardTitle>
            <CardDescription>Your position address in the lending pool</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingAddressPosition ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : (
              <div className="space-y-2">
                <div className="text-sm font-mono bg-muted p-2 rounded">
                  {addressPosition || "No position found"}
                </div>
                <div className="text-xs text-muted-foreground">
                  User: {address}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Position Balance */}
        <Card>
          <CardHeader>
            <CardTitle>Position Balance</CardTitle>
            <CardDescription>Balance of selected token in your position</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="token-select">Select Token</Label>
                <select
                  id="token-select"
                  value={selectedToken}
                  onChange={(e) => setSelectedToken(e.target.value as `0x${string}`)}
                  className="w-full mt-1 p-2 border rounded"
                >
                  {tokens.map((token) => (
                    <option key={token.address} value={token.address}>
                      {token.symbol}
                    </option>
                  ))}
                </select>
              </div>
              {isLoadingPositionBalance ? (
                <div className="text-sm text-muted-foreground">Loading...</div>
              ) : (
                <div className="text-2xl font-bold">
                  {formatValue(positionBalance, tokens.find(t => t.address === selectedToken)?.decimals || 18)}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Total Borrow Shares */}
        <Card>
          <CardHeader>
            <CardTitle>Total Borrow Shares</CardTitle>
            <CardDescription>Total borrow shares in the lending pool</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingTotalBorrowShares ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : (
              <div className="text-2xl font-bold">
                {formatValue(totalBorrowShares, 18)}
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Borrow Shares */}
        <Card>
          <CardHeader>
            <CardTitle>User Borrow Shares</CardTitle>
            <CardDescription>Your borrow shares in the lending pool</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingUserBorrowShares ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : (
              <div className="text-2xl font-bold">
                {formatValue(userBorrowShares, 18)}
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Position Address */}
        <Card>
          <CardHeader>
            <CardTitle>User Position Address</CardTitle>
            <CardDescription>Your position contract address</CardDescription>
          </CardHeader>
          <CardContent>
            {positionLoading ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : (
              <div className="text-sm font-mono bg-muted p-2 rounded">
                {userPostitionAddress || "No position address"}
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Collateral */}
        <Card>
          <CardHeader>
            <CardTitle>User Collateral</CardTitle>
            <CardDescription>Your collateral balance for selected token</CardDescription>
          </CardHeader>
          <CardContent>
            {collateralLoading ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : (
              <div className="text-2xl font-bold">
                {formatValue(userCollateral, tokens.find(t => t.address === selectedToken)?.decimals || 18)}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Summary Section */}
      <Card>
        <CardHeader>
          <CardTitle>Data Summary</CardTitle>
          <CardDescription>Overview of all position data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Connected Address:</span>
                <span className="text-sm font-mono">{address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Lending Pool:</span>
                <span className="text-sm font-mono">{lendingPool}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Selected Token:</span>
                <span className="text-sm">
                  {tokens.find(t => t.address === selectedToken)?.symbol}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Has Position:</span>
                <span className="text-sm">
                  {addressPosition && addressPosition !== "0x0000000000000000000000000000000000000000" ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Has Borrow Shares:</span>
                <span className="text-sm">
                  {userBorrowShares && userBorrowShares > BigInt(0) ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Has Collateral:</span>
                <span className="text-sm">
                  {userCollateral && userCollateral > BigInt(0) ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
