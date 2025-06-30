"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import {
  Wallet,
  HandCoins,
  TrendingUp,
  Loader2,
  CreditCard,
  SquareArrowOutUpRight,
} from "lucide-react";
import { mockUsdc, mockWeth } from "@/constants/addresses";
import type { Address } from "viem";
import { tokens } from "@/constants/token-address";
import PositionToken from "./position-token";
import { useAccount, useWriteContract } from "wagmi";
import { poolAbi } from "@/lib/abis/poolAbi";
import {
  getAllLPFactoryData,
  getSelectedLPFactoryByAddress,
} from "@/actions/GetLPFactory";
import CollateralSection from "./collateral-section";
import { toast } from "sonner";
import { createPosition } from "@/actions/CreatePosition";
import { getPositionByOwnerAndLpAddress } from "@/actions/GetPosition";
import { useReadUserCollateral } from "@/hooks/read/useReadUserCollateral";
import { useReadUserBorrowShares } from "@/hooks/read/useReadUserBorrowShares";
import { useReadTotalBorrowAssets } from "@/hooks/read/useReadTotalBorrowAssets";
import { useReadTotalBorrowShares } from "@/hooks/read/useReadTotalBorrowShares";
import { useReadAddressPosition } from "@/hooks/read/useReadAddressPosition";
import Link from "next/link";

const PositionCard = () => {
  const [positionAddress, setPositionAddress] = useState<string | undefined>(
    undefined
  );
  const [positionLength, setPositionLength] = useState<number>(0);
  const [positionsArray, setPositionsArray] = useState<any[]>([]);
  const [positionIndex, setPositionIndex] = useState<number>(-1);
  const [lpData, setLpData] = useState<any[]>([]);
  const [lpAddress, setLpAddress] = useState<string | undefined>(undefined);
  const [collateralToken, setCollateralToken] = useState<string | undefined>(
    mockWeth
  );
  const [borrowToken, setBorrowToken] = useState<string | undefined>(mockUsdc);
  const [poolIndex, setPoolIndex] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isPositionStorePending, setIsPositionStorePending] = useState(false);

  const { address } = useAccount();
  const {
    isPending: isPositionPending,
    writeContract: createPositionTransaction,
  } = useWriteContract();

  useEffect(() => {
    const fetchLpData = async () => {
      const data = await getAllLPFactoryData();
      setLpData(data);
    };
    fetchLpData();
  }, []);

  useEffect(() => {
    const fetchSelectedLPFactoryByAddress = async () => {
      setIsLoading(true);
      const data = await getSelectedLPFactoryByAddress(
        lpAddress as `0x${string}`
      );
      setCollateralToken(data?.collateralToken);
      setBorrowToken(data?.borrowToken);
      setPoolIndex(data?.poolIndex);
      setIsLoading(false);
    };
    fetchSelectedLPFactoryByAddress();
  }, [collateralToken, lpAddress]);

  useEffect(() => {
    const fetchPosition = async () => {
      const response = await getPositionByOwnerAndLpAddress(
        address as string,
        lpAddress as string
      );
      setPositionsArray(response.data);
      setPositionLength(response.data.length);
      setPositionAddress(undefined);
    };
    fetchPosition();
  }, [lpAddress]);

  const findNameToken = (address: string | undefined) => {
    if (!address) return undefined;
    const token = tokens.find(
      (asset) => asset.addresses[43113] === (address as `0x${string}`)
    );
    return token?.name;
  };
  const findLogoToken = (address: Address | undefined) => {
    const token = tokens.find((asset) => asset.addresses === address);
    return token?.logo;
  };

  const convertRealAmount = (amount: number | undefined, decimal: number) => {
    const realAmount = Number(amount) ? Number(amount) / decimal : 0; // convert to USDC
    return realAmount;
  };

  const { userCollateral } = useReadUserCollateral(
    collateralToken as `0x${string}`,
    lpAddress as `0x${string}`
  );

  const {
    userBorrowShares,
    isLoadingUserBorrowShares,
    refetchUserBorrowShares,
  } = useReadUserBorrowShares(lpAddress as `0x${string}`);

  const {
    totalBorrowAssets,
    isLoadingTotalBorrowAssets,
    refetchTotalBorrowAssets,
  } = useReadTotalBorrowAssets(lpAddress as `0x${string}`);

  const {
    totalBorrowShares,
    isLoadingTotalBorrowShares,
    refetchTotalBorrowShares,
  } = useReadTotalBorrowShares(lpAddress as `0x${string}`);

  const { addressPosition, isLoadingAddressPosition, refetchAddressPosition } =
    useReadAddressPosition(lpAddress as `0x${string}`);

  const handleAddPosition = async (address: string) => {
    try {
      createPositionTransaction({
        address: address as `0x${string}`,
        abi: poolAbi,
        functionName: "createPosition",
        args: [],
      });

      // Store in database
      const response = await createPosition(
        collateralToken as string,
        borrowToken as string,
        poolIndex as string,
        lpAddress as string,
        address
      );

      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error creating position:", error);
      toast.error("Failed to create position");
    }
  };
  const getDecimal = (address: string) => {
    const token = tokens.find((asset) => asset.addresses[43113] === address);
    return token?.decimals;
  };

  const formatTitle = () => {
    if (isLoading)
      return (
        <div className="h-10 w-32 bg-gray-200 animate-pulse rounded-xl duration-1300" />
      );
    if (!lpAddress) return "Choose Your Lending Pool";
    return `${(
      Number(userCollateral) /
      10 ** Number(getDecimal(String(collateralToken)))
    ).toFixed(5)} $${findNameToken(collateralToken)}`;
  };
  const formatCollateralAmount = () => {
    if (isLoading)
      return (
        <div className="flex justify-center">
          <Loader2 className="size-8 animate-spin duration-1000" />
        </div>
      );
    const amount = convertRealAmount(
      Number(userCollateral),
      10 ** Number(getDecimal(String(collateralToken)))
    ).toFixed(5);
    return `${amount} $${findNameToken(collateralToken)}`;
  };
  const formatBorrowAmount = () => {
    refetchUserBorrowShares();
    refetchTotalBorrowAssets();
    refetchTotalBorrowShares();
    if (
      isLoadingUserBorrowShares ||
      isLoadingTotalBorrowAssets ||
      isLoadingTotalBorrowShares ||
      isLoading
    )
      return (
        <div className="flex justify-center">
          <Loader2 className="size-8 animate-spin duration-1000" />
        </div>
      );

    const userDebt =
      (Number(userBorrowShares) * Number(totalBorrowAssets)) /
      Number(totalBorrowShares);
    const amount = convertRealAmount(
      Number(userDebt),
      10 ** Number(getDecimal(String(borrowToken)))
    ).toFixed(5);
    return `${amount} $${findNameToken(borrowToken)}`;
  };

  const formatAddressPosition = () => {
    if (isLoadingAddressPosition)
      return (
        <div className="flex justify-center">
          <Loader2 className="size-8 animate-spin duration-1000" />
        </div>
      );
    return addressPosition != "0x0000000000000000000000000000000000000000" ? (
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 text-gray-500">
          <CreditCard className="size-5" />
          <span className="text-lg">Your Position Address: </span>
        </div>
        <div>
          <Link
            href={`https://testnet.snowtrace.io/address/${addressPosition}`}
            className="text-lg text-gray-500 flex items-center gap-1 hover:text-blue-400 duration-300"
            target="_blank"
          >
            {addressPosition}
            <SquareArrowOutUpRight className="size-4" />
          </Link>
        </div>
      </div>
    ) : (
      ""
    );
  };
  const formatRate = () => {
    if (isLoading)
      return (
        <div className="flex justify-center">
          <Loader2 className="size-8 animate-spin duration-1000" />
        </div>
      );
    const rate = "3%";
    return `${rate}`;
  };
  return (
    <Card className="bg-white border shadow-sm overflow-hidden">
      <CardHeader className="pb-2 border-b py-2">
        <div className="flex bg items-center justify-between">
          <CollateralSection
            lpAddress={lpAddress as string}
            setLpAddress={setLpAddress}
            lpData={lpData}
          />
        </div>
        <div className="flex items-center gap-2 ml-7">
          <h1 className="text-lg text-gray-500">{formatTitle()}</h1>
        </div>
      </CardHeader>
      <AnimatePresence initial={false}>
        <motion.div
          key="content"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <CardContent className="px-4 md:px-6 pt-4">
            {lpAddress ? (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4 p-4 bg-white border border-blue-100 rounded-lg shadow-sm">
                  <div className="space-y-2 text-center">
                    <div className="text-xs md:text-sm text-blue-600 flex items-center justify-center gap-1 font-medium">
                      <Wallet className="h-3.5 w-3.5 text-blue-600" />
                      Total Collateral
                    </div>
                    <div className="text-base md:text-lg font-medium text-gray-800">
                      <span className="text-emerald-600">
                        {formatCollateralAmount()}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 text-center">
                    <div className="text-xs md:text-sm text-blue-600 flex items-center justify-center gap-1 font-medium">
                      <HandCoins className="h-3.5 w-3.5 text-rose-500" />
                      Your Debt
                    </div>
                    <div className="text-base md:text-lg font-medium text-gray-800">
                      <span className="text-emerald-600">
                        {formatBorrowAmount()}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 text-center">
                    <div className="text-xs md:text-sm text-blue-600 flex items-center justify-center gap-1 font-medium">
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                      Interest Rate
                    </div>
                    <div className="text-base md:text-lg font-medium text-emerald-600">
                      {formatRate()}
                    </div>
                  </div>
                </div>
                <div className="flex justify-center text-2xl font-medium items-center gap-2">
                  <div>{formatAddressPosition()}</div>
                </div>
                <div className="overflow-x-auto rounded-lg border border-blue-100 shadow-sm">
                  {addressPosition ===
                  "0x0000000000000000000000000000000000000000" ? (
                    <div className="flex flex-col items-center justify-center gap-4 p-8 text-center bg-white">
                      <div className="bg-blue-100 p-4 rounded-full">
                        <Wallet className="h-10 w-10 text-blue-600" />
                      </div>
                      <span className="text-xl md:text-2xl text-gray-800">
                        {positionLength === 0
                          ? "Ready to Start Lending?"
                          : "Connect Your Position"}
                      </span>
                      <p className="text-sm text-gray-500 max-w-md">
                        {positionLength === 0
                          ? "Begin your DeFi journey by creating your first lending position. Supply collateral and start earning while borrowing assets."
                          : "Select your position to manage your lending portfolio and track your assets."}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="grid grid-cols-3 gap-2 p-3 text-sm font-medium text-blue-700 bg-blue-50">
                        <div className="pl-4">Assets</div>
                        <div className="text-center">Current Balance</div>
                        <div className="text-center">Quick Actions</div>
                      </div>
                      <div className="divide-y divide-blue-100">
                        {tokens.map((token) => (
                          <PositionToken
                            key={token.addresses[43113]}
                            name={token.name}
                            address={token.addresses[43113]}
                            logo={token.logo as string}
                            decimal={token.decimals}
                            addressPosition={addressPosition as `0x${string}`}
                            lpAddress={lpAddress as `0x${string}`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center h-full">
                <div className="flex flex-col items-center justify-center gap-4 p-8 text-center bg-white">
                  <div className="bg-blue-100 p-4 rounded-full">
                    <Wallet className="h-10 w-10 text-blue-600" />
                  </div>
                  <span className="text-xl md:text-2xl text-gray-800">
                    Select Your Lending Pool
                  </span>
                  <p className="text-sm text-gray-500 max-w-md">
                    Choose a lending pool to view your positions and manage your
                    DeFi portfolio
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </motion.div>
      </AnimatePresence>
    </Card>
  );
};

export default PositionCard;
