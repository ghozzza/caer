"use client";

import { Wallet, ArrowUpRight, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const AmountInput = ({
  value,
  onChange,
  token,
  label,
  collateralBalance,
  disabled,
}: {
  value: string;
  onChange: (val: string) => void;
  token: string;
  label: string;
  collateralBalance: number;
  disabled: boolean;
}) => {
  return (
    <Card className="border border-slate-200 bg-white shadow-sm z-50">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-slate-700">{label}</h3>
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-700 border-purple-200"
          >
            Withdraw
          </Badge>
        </div>
        <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
          <Input
            value={value}
            onChange={(e) => {
              const val = e.target.value;
              if (
                val === "" ||
                val === "0" ||
                (val.startsWith("0.") && /^\d*\.?\d*$/.test(val)) ||
                (!val.startsWith("0") && /^\d*\.?\d*$/.test(val))
              ) {
                onChange(val);
              }
            }}
            type="text"
            inputMode="decimal"
            className="border-0 bg-transparent focus-visible:ring-0 text-lg font-medium"
            placeholder="0.00"
            disabled={disabled}
          />
          <div className="flex items-center gap-1 bg-slate-200 px-3 py-1 rounded-md">
            <Wallet className="h-4 w-4 text-slate-700" />
            <span className="font-semibold text-slate-700">
              {token.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="mt-3 text-xs text-slate-500 flex items-center justify-between">
          <div>
            <span>Your Collateral: </span>
            <span className="font-medium">
              {collateralBalance < 1 / 1e15 ? 0 : collateralBalance} $
              {token.toUpperCase()}
            </span>
          </div>
          <button
            className="text-xs p-1 text-purple-700 border border-purple-700 rounded-md hover:bg-purple-400"
            onClick={() => onChange(collateralBalance.toString())}
            disabled={disabled}
          >
            max
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

