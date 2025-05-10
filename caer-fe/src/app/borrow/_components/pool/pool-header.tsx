import { CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

const PoolHeader = () => {
  return (
    <CardHeader className="pb-2 pt-6 px-6">
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Available Pools
          </CardTitle>
        </div>
      </div>
    </CardHeader>
  );
};

export default PoolHeader;
