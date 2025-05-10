import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useSupply } from "@/hooks/write/useSupply";
import { CreditCard, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TOKEN_OPTIONS } from "@/constants/tokenOption";
import { toast } from "sonner";
import { useAccount, useReadContract, useWriteContract, useChainId } from 'wagmi';
import { createLPFactory } from "@/actions/CreateLPFactory";
import { factory } from "@/constants/addresses";
import { factoryAbi } from "@/lib/abi/factoryAbi";
import { getSelectedLPFactorybyColBor } from "@/actions/GetLPFactory";

interface DialogCreatePoolProps {
  onRefetch: () => void;
}

const DialogCreatePool: React.FC<DialogCreatePoolProps> = ({ onRefetch }) => {
  const {
    isApprovePending,
    isSupplyPending,
    isApproveLoading,
    isSupplyLoading,
    isProcessing,
  } = useSupply();
  const { isConnected, address } = useAccount();

  const [isOpen, setIsOpen] = useState(false);
  const [collateralToken, setCollateralToken] = useState("");
  const [borrowToken, setBorrowToken] = useState("");
  const [ltv, setLtv] = useState("");
  const [isCreateLPPending, setIsCreateLPPending] = useState(false);
  const [firstCompile, setFirstCompile] = useState(true);
  const isTransactionPending =
    isApprovePending ||
    isSupplyPending ||
    isApproveLoading ||
    isSupplyLoading ||
    isProcessing;
  const isButtonDisabled =
    isTransactionPending || !collateralToken || !borrowToken || !ltv;

  const { isPending: isCreatePending, writeContract: createLendingPool } =
    useWriteContract();
  
  // read pool count
  useEffect(() => {
    const handleCreatePool = async () => {
      if (firstCompile) {
        setFirstCompile(false);
      } else if (isCreatePending) {
        setIsCreateLPPending(true);
      } else {
        setIsCreateLPPending(false);
        const ltvNumber = Number(ltv) * 1e16;
        console.log(collateralToken, borrowToken, ltvNumber);
        const response = await createLPFactory(
          String(address),
          collateralToken,
          borrowToken,
          String(ltvNumber)
        );
        if (response.success) {
          toast.success("Pool created successfully");
          onRefetch();
          setIsOpen(false);
          setCollateralToken("");
          setBorrowToken("");
          setLtv("");
        } else if (response.success === false) {
          toast.error(response.message);
        }
      }
    };
    handleCreatePool();
  }, [isCreatePending]);

  const createPool = async () => {
    const ltvNumber = Number(ltv) * 1e16;
    if (isConnected) {
      try {
        const existingPool = await getSelectedLPFactorybyColBor(
          collateralToken,
          borrowToken
        );
        if (existingPool) {
          toast.error("Pool already exists");
          return;
        }
        createLendingPool({
          address: factory,
          abi: factoryAbi,
          functionName: "createLendingPool",
          args: [collateralToken, borrowToken, ltvNumber],
        });
      } catch (error) {
        console.error("Error creating pool:", error);
        toast.error("Failed to create pool");
      }
    } else toast.error("Please connect your wallet");
  };
  return (
    <div>
      <Dialog
        open={isOpen}
        onOpenChange={
          address ? setIsOpen : () => toast.error("Please connect your wallet")
        }
      >
        <DialogTrigger asChild>
          <Button
            className="bg-gradient-to-r from-indigo-400 to-blue-600 hover:from-indigo-500 hover:to-blue-600 text-white font-medium shadow-md hover:shadow-lg transition-colors duration-300 rounded-lg cursor-pointer"
            size="default"
          >
            Create Pool
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-gradient-to-b from-white to-slate-50 border-0 shadow-xl rounded-xl">
          <DialogHeader className="pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <CreditCard className="h-6 w-6 text-blue-500" />
              <DialogTitle className="text-xl font-bold text-slate-800">
                Create Pool
              </DialogTitle>
              <DialogDescription className="hidden">
                Fixed the warning
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <Card className="border border-slate-200 bg-white shadow-sm">
              <CardContent className="px-4">
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-slate-700">
                      Collateral Token
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <Select
                      value={collateralToken}
                      onValueChange={setCollateralToken}
                    >
                      <SelectTrigger className="w-full border-0 focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer">
                        <SelectValue placeholder="Select Collateral Token" />
                      </SelectTrigger>
                      <SelectContent>
                        {TOKEN_OPTIONS.map(
                          (token) =>
                            token.address !== borrowToken && (
                              <SelectItem
                                key={token.address}
                                value={token.address}
                                className="cursor-pointer focus:bg-blue-500/70 focus:text-white duration-300 transition-colors"
                              >
                                {token.name}
                              </SelectItem>
                            )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-slate-700">
                      Borrow Token
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <Select value={borrowToken} onValueChange={setBorrowToken}>
                      <SelectTrigger className="w-full border-0 focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer">
                        <SelectValue placeholder="Select Borrow Token" />
                      </SelectTrigger>
                      <SelectContent>
                        {TOKEN_OPTIONS.map(
                          (token) =>
                            token.address !== collateralToken && (
                              <SelectItem
                                key={token.address}
                                value={token.address}
                                className="cursor-pointer focus:bg-blue-500/70 focus:text-white duration-300 transition-colors"
                              >
                                {token.name}
                              </SelectItem>
                            )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-slate-700">LTV</h3>
                  </div>
                  <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <Input
                      placeholder="Enter LTV"
                      value={ltv}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || /^\d*\.?\d*$/.test(value)) {
                          setLtv(value);
                        }
                      }}
                      disabled={isTransactionPending}
                      className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-lg font-medium placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter>
            <Button
              onClick={createPool}
              disabled={isButtonDisabled}
              className={`w-full h-12 text-base font-medium rounded-lg  ${
                isButtonDisabled
                  ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-indigo-400 hover:from-blue-600 hover:to-indigo-500 text-white shadow-md hover:shadow-lg cursor-pointer"
              }`}
            >
              {isTransactionPending ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  <span>Creating Pool...</span>
                </div>
              ) : (
                <span>Create Pool</span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DialogCreatePool;
