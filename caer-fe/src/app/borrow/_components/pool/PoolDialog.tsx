import React, { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import SupplyCollateralSection from "./SupplyCollateralSection";
import BorrowSection from "./BorrowSection";
import WithdrawCollateralSection from "./WithdrawCollateralSection";
import { TOKEN_OPTIONS } from "@/constants/tokenOption";
import { Slash } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { RepaySection } from "./RepaySection";
import { useReadLendingData } from "@/hooks/read/useReadLendingData";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import ButtonConnectWallet from "@/components/navbar/button-connect-wallet";

interface PoolDialogProps {
  isOpen?: boolean;
  onClose: () => void;
  collateralToken: string;
  loanToken: string;
  ltv: string;
  liquidity: string;
  rate: string;
  lpAddress: string;
  borrowAddress: string;
}

const PoolDialog = ({
  isOpen,
  onClose,
  collateralToken,
  loanToken,
  ltv,
  liquidity,
  rate,
  lpAddress,
  borrowAddress,
}: PoolDialogProps) => {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState<
    "supply" | "withdraw" | "borrow" | "repay"
  >("supply");
  const { refetchAll } = useReadLendingData(
    undefined,
    undefined,
    lpAddress as `0x${string}`
  );

  const getTokenLogo = (name: string) => {
    const token = TOKEN_OPTIONS.find((token) => token.name === name);
    return token?.logo;
  };
  const activeNameSupply = () => {
    if (activeTab === "supply") return "Supply Collateral";
    if (activeTab === "withdraw") return "Withdraw Collateral";
    return "Supply Collateral";
  };
  const activeNameBorrow = () => {
    if (activeTab === "borrow") return "Borrow Debt";
    if (activeTab === "repay") return "Repay Loan";
    return "Borrow Debt";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-b from-white to-slate-50 border-0 shadow-xl rounded-xl backdrop-blur-md">
        <DialogTitle className="text-2xl font-bold text-center">
          <div className="flex items-center justify-center gap-1">
            <div className="flex items-center gap-2">
              <Image
                src={getTokenLogo(collateralToken) ?? "/placeholder.png"}
                alt={collateralToken}
                width={24}
                height={24}
              />
              <span className="text-lg font-bold">{collateralToken}</span>
            </div>
            <div className="flex items-center gap-2">
              <Slash />
            </div>
            <div className="flex items-center gap-2">
              <Image
                src={getTokenLogo(loanToken) ?? "/placeholder.png"}
                alt={loanToken}
                width={24}
                height={24}
              />
              <span className="text-lg font-bold">{loanToken}</span>
            </div>
          </div>
        </DialogTitle>
        <DialogDescription className="text-center text-sm text-gray-500 hidden">
          {ltv}
        </DialogDescription>
        {address ? (
          <div className="grid gap-4 py-4">
            <div className="flex border-b cursor-pointer">
              <NavigationMenu
                className={cn(
                  activeTab === "supply" || activeTab === "withdraw"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600"
                )}
              >
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="cursor-pointer">
                      {activeNameSupply()}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul
                        className={cn(
                          "px-0 py-0 text-sm font-medium transition-colors flex justify-center items-center flex-col w-[400px] gap-1 p-0 md:w-[500px] lg:w-[160px]"
                        )}
                      >
                        <ListItem
                          onClick={() => setActiveTab("supply")}
                          className="cursor-pointer"
                        >
                          Supply Collateral
                        </ListItem>
                        <ListItem
                          onClick={() => setActiveTab("withdraw")}
                          className="cursor-pointer"
                        >
                          Withdraw Collateral
                        </ListItem>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
              <NavigationMenu
                className={cn(
                  activeTab === "borrow" || activeTab === "repay"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600"
                )}
              >
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="cursor-pointer">
                      {activeNameBorrow()}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul
                        className={cn(
                          "px-0 py-0 text-sm font-medium transition-colors flex justify-center items-center flex-col w-[400px] gap-1 p-0 md:w-[500px] lg:w-[160px]"
                        )}
                      >
                        <ListItem
                          onClick={() => setActiveTab("borrow")}
                          className="cursor-pointer"
                        >
                          Borrow Debt
                        </ListItem>
                        <ListItem
                          onClick={() => setActiveTab("repay")}
                          className="cursor-pointer"
                        >
                          Repay Loan
                        </ListItem>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            <div className="relative overflow-hidden">
              <div
                className={cn(
                  "transition-opacity duration-300 ease-in-out",
                  activeTab === "supply"
                    ? "opacity-100 max-h-[1000px]"
                    : "opacity-0 max-h-0 hidden"
                )}
              >
                <SupplyCollateralSection
                  collateralToken={collateralToken}
                  lpAddress={lpAddress}
                  onSuccess={() => {
                    onClose();
                    refetchAll();
                  }}
                />
              </div>
              <div
                className={cn(
                  "transition-opacity duration-300 ease-in-out",
                  activeTab === "withdraw"
                    ? "opacity-100 max-h-[1000px]"
                    : "opacity-0 max-h-0 hidden"
                )}
              >
                <WithdrawCollateralSection
                  collateralToken={collateralToken}
                  lpAddress={lpAddress}
                  onSuccess={() => {
                    onClose();
                    refetchAll();
                  }}
                />
              </div>
              <div
                className={cn(
                  "transition-opacity duration-300 ease-in-out",
                  activeTab === "borrow"
                    ? "opacity-100 max-h-[1000px]"
                    : "opacity-0 max-h-0 hidden"
                )}
              >
                <BorrowSection
                  collateralToken={collateralToken}
                  loanToken={loanToken}
                  lpAddress={lpAddress}
                  onTransactionSuccess={() => onClose()}
                />
              </div>
              <div
                className={cn(
                  "transition-opacity duration-300 ease-in-out",
                  activeTab === "repay"
                    ? "opacity-100 max-h-[1000px]"
                    : "opacity-0 max-h-0 hidden"
                )}
              >
                <RepaySection
                  lpAddress={lpAddress}
                  borrowToken={loanToken}
                  onSuccess={() => {
                    onClose();
                    refetchAll();
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div
            className="flex justify-center items-center h-full py-10"
            onClick={() => onClose()}
            role="button"
            tabIndex={0}
            onKeyDown={() => onClose()}
          >
            <ButtonConnectWallet />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
export default PoolDialog;
