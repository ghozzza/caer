"use client";

import React from "react";
import { formatUnits } from "viem";
import { useReadUserCollateral } from "@/hooks/read/useReadUserCollateral";
import { getLendingPoolAddress } from "@/lib/util/get-lending-pool";
import { useAccount } from "wagmi";

const CollateralPage = () => {
  const { chain } = useAccount(); // Ambil chain saat ini dari Wagmi

  const {
    userPostitionAddress,
    userCollateral,
    positionLoading,
    collateralLoading,
    positionError,
    collateralError,
    wethToken,
  } = useReadUserCollateral();

  const lendingPoolAddress = chain?.id
    ? getLendingPoolAddress(chain.id)
    : undefined;

  const formattedBalance =
    userCollateral && wethToken
      ? formatUnits(userCollateral as bigint, wethToken.decimals)
      : null;

  return (
    <div className="mt-16 space-y-4">
      <div>
        <strong>Position Address:</strong>{" "}
        {positionLoading
          ? "Loading..."
          : positionError
          ? "Error fetching position"
          : userPostitionAddress ?? "No data"}
      </div>

      <div>
        <strong>Lending Pool Address:</strong>{" "}
        {lendingPoolAddress ?? "No address available"}
      </div>

      <div>
        <strong>Collateral (WETH):</strong>{" "}
        {collateralLoading
          ? "Loading..."
          : collateralError
          ? "Error fetching collateral"
          : formattedBalance ?? "No data"}
      </div>
    </div>
  );
};

export default CollateralPage;
