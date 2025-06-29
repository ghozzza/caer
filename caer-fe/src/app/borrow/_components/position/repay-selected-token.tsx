"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ArrowDown, CreditCard, DollarSign, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useReadPositionBalance } from "@/hooks/read/useReadPositionBalance";
import { tokens } from "@/constants/token-address";
import { useReadBorrowToken } from "@/hooks/read/useReadBorrowToken";
import { useReadCollateralToken } from "@/hooks/read/useReadCollateralToken";
import { useReadTotalBorrowShares } from "@/hooks/read/useReadTotalBorrowShares";
import { useReadUserBorrowShares } from "@/hooks/read/useReadUserBorrowShares";
import { useReadTotalBorrowAssets } from "@/hooks/read/useReadTotalBorrowAssets";
import { useTokenCalculator } from "@/hooks/read/useTokenCalculator";
import { useRepayWithSelectedToken } from "@/hooks/write/useRepayWithSelectedToken";
import { useState } from "react";

const AmountInput = ({
  value,
  onChange,
  token,
  positionToken,
  borrowToken,
  balance,
  label,
}: any) => {
  return (
    <Card className="border border-gray-200 bg-white shadow-sm">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-gray-800">{label}</h3>
          <Badge
            variant="outline"
            className="bg-emerald-50 text-emerald-700 border-emerald-200"
          >
            Repay
          </Badge>
        </div>

        <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg border border-gray-200">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-lg font-semibold text-gray-900"
            placeholder="0.00"
          />
          <div className="flex items-center gap-1 bg-gray-200 px-3 py-1 rounded-md">
            <DollarSign className="h-4 w-4 text-gray-800" />
            <span className="font-semibold text-gray-800">{borrowToken}</span>
          </div>
        </div>

        <div className="mt-3 text-xs text-gray-500 flex items-center justify-between">
          <span>
            Position Balance: {balance} ${positionToken}
          </span>
          <button
            className="text-xs p-1 text-emerald-700 border border-emerald-700 rounded-md hover:bg-emerald-100 cursor-pointer"
            onClick={() => onChange(balance)}
          >
            max
          </button>
        </div>
        <span className="text-xs text-gray-700">
          Amount: {Number(value).toFixed(5)} {borrowToken}
        </span>
      </CardContent>
    </Card>
  );
};

export const RepaySelectedToken = (props: any) => {

  const [valueAmount, setValueAmount] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const tokenAddress = tokens.find((token) => token.name === props.tokenName)
    ?.addresses[43113];

  const borrowTokenAddress = tokens.find(
    (token) => token.name === props.borrowToken
  )?.addresses[43113];

  const borrowTokenDecimal = tokens.find(
    (token) => token.name === props.borrowToken
  )?.decimals;

  const collateralTokenAddress = tokens.find(
    (token) => token.name === props.collateralToken
  )?.addresses[43113];

  const collateralTokenDecimal = tokens.find(
    (token) => token.name === props.collateralToken
  )?.decimals;

  const { positionBalance } = useReadPositionBalance(
    collateralTokenAddress as `0x${string}`,
    props.addressPosition
  );

  const { borrowToken } = useReadBorrowToken(props.lpAddress);
  const { collateralToken } = useReadCollateralToken(props.lpAddress);

  const borrowTokenName = tokens.find(
    (token) => token.addresses[43113] === borrowToken
  )?.name;

  const collateralTokenName = tokens.find(
    (token) => token.addresses[43113] === collateralToken
  )?.name;

  // use repay with selected token
  const { repay } = useRepayWithSelectedToken(tokenAddress as `0x${string}`, props.lpAddress, true);

  const { price } = useTokenCalculator(
    borrowTokenAddress as `0x${string}`,
    tokenAddress as `0x${string}`,
    Number(valueAmount),
    props.addressPosition
  );

  const { userBorrowShares } = useReadUserBorrowShares(props.lpAddress);
  const { totalBorrowAssets } = useReadTotalBorrowAssets(props.lpAddress);
  const { totalBorrowShares } = useReadTotalBorrowShares(props.lpAddress);

  const userDebt = (
    (Number(userBorrowShares) * Number(totalBorrowAssets)) /
    Number(totalBorrowShares)
  ).toFixed(5);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 rounded-lg cursor-pointer">
          <ArrowDown className="mr-2 h-4 w-4" />
          Repay
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white border border-gray-200 shadow-xl rounded-xl">
        <DialogHeader className="pb-2 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-emerald-600" />
            <DialogTitle className="text-xl font-bold text-gray-900">
              Repay Loan
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <AmountInput
            value={valueAmount}
            onChange={setValueAmount}
            token={props.borrowToken}
            positionToken={props.tokenName}
            borrowToken={props.borrowToken}
            balance={props.tokenBalance}
            label="Repay Amount"
            price={price}
          />

          <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
            <div className="flex items-start">
              <div className="bg-emerald-100 p-1 rounded-full mr-2">
                <CreditCard className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <h4 className="text-xs font-medium text-emerald-800 mb-1">
                  Debt Information
                </h4>
                <p className="text-xs text-emerald-700">
                  Debt:{" "}
                  {(Number(userDebt) / 10 ** (borrowTokenDecimal || 0)).toFixed(
                    5
                  )}{" "}
                  ${borrowTokenName}
                  <br />
                  Equals to {price.toFixed(6)} ${props.tokenName}
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={() => repay(valueAmount)}
            disabled={
              isPending || !valueAmount || Number.parseFloat(valueAmount) <= 0
            }
            className={`w-full h-12 text-base font-medium rounded-lg cursor-pointer ${
              isPending
                ? "bg-gray-200 text-gray-500"
                : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-md hover:shadow-lg"
            }`}
          >
            {isPending ? (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span>Processing Repayment...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <ArrowDown className="mr-2 h-5 w-5" />
                <span>Repay {props.name}</span>
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
