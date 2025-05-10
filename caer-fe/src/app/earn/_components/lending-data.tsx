"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { getAllLPFactoryData } from "@/actions/GetLPFactory";
import DialogCreatePool from "./DialogCreatePool";
import RowTable from "./RowTable";

const LendingData = () => {
  const { isConnected } = useAccount();
  const [lpData, setLpData] = useState<any[]>([]);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllLPFactoryData();
      setLpData(data);
    };
    fetchData();
  }, [refetchTrigger]);

  return (
    <div className="min-h-screen text-white">
      <main className="max-w-7xl mx-auto">
        <div className="flex justify-start mb-5">
          <DialogCreatePool
            onRefetch={() => setRefetchTrigger((prev) => prev + 1)}
          />
        </div>
        <div className="bg-[#F0F2FF] border border-[#9EC6F3] rounded-lg overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#9EC6F3]">
                    <th className="text-center p-4 text-sm font-medium text-[#1016BC]">
                      Loan
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-[#1016BC]">
                      <div className="flex items-center">Liquidity</div>
                    </th>

                    <th className="text-left p-4 text-sm font-medium text-[#1016BC]">
                      Collateral
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-[#1016BC]">
                      APY
                    </th>
                    <th className="text-center p-4 text-sm font-medium text-[#1016BC]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* <tr className="border-b border-[#9EC6F3] hover:bg-[#1016BC]/5 duration-300">
                    <td className="px-4 text-left">
                      <div className="flex items-center justify-center space-x-1">
                        <div>
                          <Image
                            src={
                              TOKEN_OPTIONS.find(
                                (token) => token?.name === "USDC"
                              )?.logo ?? "/placeholder.svg"
                            }
                            alt="USDC"
                            width={100}
                            height={100}
                            className="w-7 h-7 rounded-full"
                          />
                        </div>
                        <div>
                          <div className="font-medium text-gray-700">$USDC</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-500">
                      <div>
                        <div className="font-medium">
                          <p>
                            {realTotalSupplyAssets
                              ? realTotalSupplyAssets.toLocaleString("en-US")
                              : "0.00"}{" "}
                            $USDC
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center space-x-1 text-gray-400 gap-3">
                        <div>
                          <Image
                            src={
                              TOKEN_OPTIONS.find(
                                (token) => token?.name === "WETH"
                              )?.logo ?? "/placeholder.svg"
                            }
                            alt="USDC"
                            width={100}
                            height={100}
                            className="w-7 h-7 rounded-full"
                          />
                        </div>
                        <div>$WETH</div>
                      </div>
                    </td>
                    <td className="p-4 text-left">
                      <div className="font-medium text-green-500">5.62%</div>
                    </td>
                    <td className="p-4 text-center flex justify-center">
                      <div className="flex items-center gap-2">
                        <div>
                          <DialogSupply
                            lpAddress={lendingPool}
                            borrowToken={mockUsdc}
                          />
                        </div>
                        <div>
                          <DialogWithdraw />
                        </div>
                      </div>
                    </td>
                  </tr> */}
                  {lpData.length > 0 ? (
                    lpData.map(
                      (item) =>
                        item.borrowToken && (
                          <RowTable
                            key={item.id}
                            borrowToken={item.borrowToken}
                            collateralToken={item.collateralToken}
                            lpAddress={item.lpAddress}
                          />
                        )
                    )
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-4">
                        <div className="animate-pulse flex flex-col gap-4 duration-1000">
                          <div className="h-10 bg-slate-200 rounded"></div>
                          <div className="h-10 bg-slate-200 rounded"></div>
                          <div className="h-10 bg-slate-200 rounded"></div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </div>
      </main>
      <div className="mt-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[#F0F2FF] backdrop-blur-sm border border-[#9EC6F3] p-5 rounded-xl">
          <h3 className="text-lg font-medium text-[#1016BC] mb-4">
            Market Overview
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#1192FC] bg-opacity-20 rounded-full"></div>
                <span>Total Market Size</span>
              </div>
              <span className="font-medium">$495.84M</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#00EDBE] bg-opacity-20 rounded-full"></div>
                <span>Total Available</span>
              </div>
              <span className="font-medium">$130.97M</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#1016BC] bg-opacity-20 rounded-full"></div>
                <span>Utilization Rate</span>
              </div>
              <span className="font-medium">73.6%</span>
            </div>
          </div>
        </Card>

        <Card className="bg-[#F0F2FF] backdrop-blur-sm border border-[#9EC6F3] p-5 rounded-xl">
          <h3 className="text-lg font-medium text-[#1016BC] mb-4">
            Your Position
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#1192FC] bg-opacity-20 rounded-full"></div>
                <span>Supplied</span>
              </div>
              <span className="font-medium">$0.00</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#00EDBE] bg-opacity-20 rounded-full"></div>
                <span>Borrowed</span>
              </div>
              <span className="font-medium">$0.00</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#1016BC] bg-opacity-20 rounded-full"></div>
                <span>Net APY</span>
              </div>
              <span className="font-medium">0.00%</span>
            </div>
            <div className="flex justify-center mx-auto">
              {!isConnected ? <ConnectButton /> : ""}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LendingData;
