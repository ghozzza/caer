"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { getAllLPFactoryData } from "@/actions/GetLPFactory";
import DialogCreatePool from "./DialogCreatePool";
import RowTable from "./RowTable";
import { PlusCircle, ArrowRight } from "lucide-react";

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
                      <td colSpan={5} className="p-4 text-center">
                        <div className="text-[#1016BC] py-8">
                          <div className="flex flex-col items-center gap-4">
                            <PlusCircle className="w-12 h-12 text-[#1016BC] opacity-80" />
                            <p className="text-lg font-medium">There is no lending pool here</p>
                            <div className="flex items-center gap-2 text-sm text-[#1016BC] opacity-80">
                              <p>Please create a pool to get started</p>
                              <ArrowRight className="w-4 h-4" />
                            </div>
                          </div>
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
      <div className="mt-8 max-w-7xl mx-auto grid-cols-1 md:grid-cols-2 gap-6 hidden">
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
