"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { readLendingData } from "@/hooks/read/useReadLendingData";
import { poolAbi } from "@/lib/abi/poolAbi";
import { CreditCard, DollarSign, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAccount, useWriteContract } from "wagmi";
interface DialogWithdrawProps {
  lpAddress?: string;
  onSuccess?: () => void;
}
const DialogWithdraw = (props: DialogWithdrawProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [liquidity, setLiquidity] = useState<number | string>("0.00");

  const [error, setError] = useState<string | null>(null);

  const { address } = useAccount();

  const fetchLiquidity = async (lpAddress: string) => {
    const data = await readLendingData(lpAddress as `0x${string}`);
    setLiquidity(
      Number(data.message) !== 0 ? Number(data.message) / 1e6 : "0.00"
    );
  };

  useEffect(() => {
    fetchLiquidity(props.lpAddress ?? "");
  }, []);

  const { data: withdrawHash, writeContract: withdrawTransaction } =
    useWriteContract();

  const handleBorrow = async () => {
    setIsProcessing(true);
    setError(null);

    if (!amount || isNaN(Number(amount))) {
      setError("Invalid withdraw amount");
      setIsProcessing(false);
      return;
    }

    const supplyAmountBigInt = BigInt(Number(amount) * 10 ** 6);

    try {
      withdrawTransaction({
        abi: poolAbi,
        address: props.lpAddress as `0x${string}`,
        functionName: "withdraw",
        args: [supplyAmountBigInt],
      });

      console.log("🚀 Withdraw transaction sent!");
    } catch (err) {
      console.error("❌ Transaction failed:", err);
      setError("Transaction failed. Please try again.");
      toast.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (withdrawHash) {
      toast.success("Withdraw successful!");
      setIsOpen(false);
      setAmount("");
      if (props.onSuccess) {
        props.onSuccess();
      }
    }
  }, [withdrawHash, props.onSuccess]);

  return (
    <div>
      <Dialog
        open={isOpen}
        onOpenChange={
          address ? setIsOpen : () => toast.error("Please connect your wallet")
        }
        aria-describedby="dialog-description"
      >
        <DialogTrigger asChild>
          <Button
            className="bg-gradient-to-r from-indigo-400 to-blue-600  hover:from-indigo-500 hover:to-blue-600 text-white font-medium shadow-md hover:shadow-lg transition-colors duration-300 rounded-lg cursor-pointer"
            size="default"
          >
            Withdraw
          </Button>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-md bg-gradient-to-b from-white to-slate-50 border-0 shadow-xl rounded-xl"
          aria-describedby="dialog-descriptionx"
        >
          <DialogHeader className="pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <CreditCard className="h-6 w-6 text-blue-500" />
              <DialogTitle className="text-xl font-bold text-slate-800">
                Withdraw USDC
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <Card className="border border-slate-200 bg-white shadow-sm">
              <CardContent className="px-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-slate-700">
                    Withdraw Amount
                  </h3>
                </div>

                <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <Input
                    placeholder={`Enter amount of USDC to withdraw`}
                    value={amount}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "" || /^\d*\.?\d*$/.test(value)) {
                        setAmount(value);
                      }
                    }}
                    disabled={isProcessing}
                    min="0"
                    className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-lg font-medium"
                  />
                  <div className="flex items-center gap-1 bg-slate-200 px-3 py-1 rounded-md">
                    <DollarSign className="h-4 w-4 text-slate-700" />
                    <span className="font-semibold text-slate-700">USDC</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs mt-2">
                  <span className="text-gray-400">Your Supply : </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-gray-600">{Number(liquidity)}</span>
                    <button
                      onClick={() => setAmount(String(Number(liquidity)))}
                      className="text-xs px-2 p-0.5 border border-blue-500 rounded-md text-blue-500 hover:bg-blue-200 cursor-pointer duration-300 transition-colors"
                    >
                      Max
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter>
            <Button
              onClick={handleBorrow}
              disabled={isProcessing || !amount}
              className={`w-full h-12 text-base font-medium rounded-lg ${
                isProcessing
                  ? "bg-slate-200 text-slate-500"
                  : "bg-gradient-to-r from-blue-500 to-indigo-400 hover:from-blue-600 hover:to-indigo-500 text-white shadow-md hover:shadow-lg cursor-pointer"
              }`}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  <span>Processing Transaction...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span>{`Withdraw USDC`}</span>
                </div>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DialogWithdraw;
