"use client";

import { useState } from "react";
import { useWriteContract } from "wagmi";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { mockErc20Abi } from "@/lib/abi/mockErc20Abi";
import { poolAbi } from "@/lib/abi/poolAbi";
import { ArrowDown, CreditCard, DollarSign, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useReadLendingData } from "@/hooks/read/useReadLendingData";
import { TOKEN_OPTIONS } from "@/constants/tokenOption";
import { toast } from "sonner";
import { on } from "events";

const AmountInput = ({ value, onChange, token, label, lpAddress }: any) => {
  const { dynamicUserBorrow } = useReadLendingData(
    undefined,
    undefined,
    lpAddress as `0x${string}`
  );
  const tokenDecimal = TOKEN_OPTIONS.find(
    (option) => option.name === token
  )?.decimals;
  return (
    <Card className="border border-slate-200 bg-white shadow-sm">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-slate-700">{label}</h3>
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Repay
          </Badge>
        </div>

        <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-lg font-medium"
            placeholder="0.00"
          />
          <div className="flex items-center gap-1 bg-slate-200 px-3 py-1 rounded-md">
            <DollarSign className="h-4 w-4 text-slate-700" />
            <span className="font-semibold text-slate-700">Shares</span>
          </div>
        </div>

        <div className="mt-3 text-xs text-slate-500 flex items-center justify-between">
          <span className="text-sm text-blue-700">Debt :</span>
          <div className="flex items-center text-xs gap-2">
            <span>
              {dynamicUserBorrow
                ? Number(dynamicUserBorrow) / (10 ** Number(tokenDecimal))
                : "0.00"}{" "}
              ${token}
            </span>
            <button
              className="text-xs p-0.5 text-blue-500 rounded-md border border-blue-500 hover:bg-blue-300 cursor-pointer"
              onClick={() =>
                onChange(
                  dynamicUserBorrow
                    ? Number(dynamicUserBorrow) / (10 ** Number(tokenDecimal))
                    : "0.00"
                )
              }
            >
              Max
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const RepaySection = ({
  lpAddress,
  borrowToken,
  onSuccess,
}: {
  lpAddress: string;
  borrowToken: string;
  onSuccess: () => void;
}) => {
  const tokenAddress = TOKEN_OPTIONS.find(
    (token) => token.name === borrowToken
  )?.address;
  const { dynamicTotalBorrowAssets, dynamicTotalBorrowShares, dynamicUserBorrow } =
    useReadLendingData(undefined, undefined, lpAddress as `0x${string}`);
  const tokenDecimal = TOKEN_OPTIONS.find(
    (option) => option.name === borrowToken
  )?.decimals;
  const [usdcAmount, setUsdcAmount] = useState("0");
  const [isOpen, setIsOpen] = useState(false);
  const { writeContract, isPending } = useWriteContract();

  const handleApproveAndRepay = async () => {
    if (!usdcAmount || Number(usdcAmount) <= 0) {
      console.error("Please enter a valid amount to repay");
      return;
    }

    setIsOpen(true);
    const amount = Number(usdcAmount) * (10 ** Number(tokenDecimal));
    const result = Math.round(
      (amount * Number(dynamicTotalBorrowAssets)) / Number(dynamicTotalBorrowShares) + amount
    );

    try {
      writeContract({
        address: tokenAddress as `0x${string}`,
        abi: mockErc20Abi,
        functionName: "approve",
        args: [lpAddress as `0x${string}`, BigInt(result)],
      });

      writeContract({
        address: lpAddress as `0x${string}`,
        abi: poolAbi,
        functionName: "repayByPosition",
        args: [BigInt(amount)],
      });

      setUsdcAmount("0");
      setIsOpen(false);
      onSuccess();
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  const debtEquals = () => {
    if (
      !dynamicTotalBorrowAssets ||
      !dynamicTotalBorrowShares ||
      !dynamicUserBorrow ||
      Number(dynamicTotalBorrowShares) === 0
    ) {
      return 0;
    }
    return (
      (Number(dynamicUserBorrow) * Number(dynamicTotalBorrowAssets)) /
      Number(dynamicTotalBorrowShares)
    );
  };

  return (
    <>
      <div className="space-y-6 py-4">
        <AmountInput
          value={usdcAmount}
          onChange={setUsdcAmount}
          lpAddress={lpAddress}
          token={borrowToken}
          label="Repay Amount"
        />
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
          <div className="flex items-start">
            <div className="bg-blue-100 p-1 rounded-full mr-2">
              <CreditCard className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h4 className="text-xs font-medium text-blue-700 mb-1">
                Repayment Information
              </h4>
              <p className="text-xs text-blue-600">
                Debt: {dynamicUserBorrow ? Number(dynamicUserBorrow) / (10 ** Number(tokenDecimal)) : "0.00"} Shares
              </p>
              <p className="text-xs text-blue-600 mt-3">
                Equals to {debtEquals() / (10 ** Number(tokenDecimal))} {borrowToken}
              </p>
            </div>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button
          onClick={handleApproveAndRepay}
          disabled={isPending || !usdcAmount || Number(usdcAmount) <= 0}
          className="w-full h-12 text-base font-medium rounded-lg cursor-pointer"
        >
          {isPending ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <ArrowDown className="mr-2 h-5 w-5" />
          )}{" "}
          Repay
        </Button>
      </DialogFooter>
    </>
  );
};
