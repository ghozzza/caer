"use client";
import React, { useEffect, useState } from "react";
import PoolDialog from "./pool-dialog";
import { getAllLPFactoryData } from "@/actions/GetLPFactory";
import RowPool from "./row-pool";
import { Loader2 } from "lucide-react";

const PoolList = () => {
  const [selectedPool, setSelectedPool] = useState<{
    collateralToken: string;
    loanToken: string;
    ltv: string;
    liquidity: string;
    rate: string;
    lpAddress: string;
    borrowAddress: string;
  } | null>(null);
  const [lpData, setLpData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleRowClick = (pool: {
    collateralToken: string;
    loanToken: string;
    ltv: string;
    liquidity: string;
    rate: string;
    lpAddress: string;
    borrowAddress: string;
  }) => {
    setSelectedPool(pool);
  };


  useEffect(() => {
    const fetchLpData = async () => {
      setIsLoading(true);
      const data = await getAllLPFactoryData();
      setLpData(data);
      setIsLoading(false);
    };
    fetchLpData();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-full py-10">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }

    if (lpData.length === 0) {
      return (
        <div className="flex justify-center items-center h-full py-10">
          <p className="text-gray-500">No data available</p>
        </div>
      );
    }

    return lpData.map((pool) => (
      <RowPool
        key={pool.id}
        collateralToken={pool.collateralToken}
        borrowToken={pool.borrowToken}
        ltv={pool.ltv}
        lpAddress={pool.lpAddress}
        rate={pool.rate}
        handleRowClick={handleRowClick}
        borrowAddress={pool.borrowAddress}
      />
    ));
  };

  return (
    <div className="px-6 pb-6">
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-slate-100 px-6 py-3">
          <div className="grid grid-cols-5 gap-4 items-center text-center">
            <div className="text-sm font-medium text-gray-600">Collateral</div>
            <div className="text-sm font-medium text-gray-600">Loan</div>
            <div className="text-sm font-medium text-gray-600">LTV</div>
            <div className="text-sm font-medium text-gray-600">Liquidity</div>
            <div className="text-sm font-medium text-gray-600">Rate</div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {renderContent()}
        </div>
      </div>

      {selectedPool && (
        <PoolDialog
          isOpen={!!selectedPool}
          onClose={() => setSelectedPool(null)}
          {...selectedPool}
        />
      )}
    </div>
  );
};

export default PoolList;
