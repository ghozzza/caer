"use client";
import { CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useReadLendingData } from "@/hooks/read/useReadLendingData";
import { CircleDollarSign } from "lucide-react";
import Image from "next/image";
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CollateralSection = (props: {
  lpAddress: string;
  setLpAddress: (value: string) => void;
  lpData: any[];
  findLogoToken: (address: string) => string;
  findNameToken: (address: string) => string;
  setDynamicUserCollateral: (value: number) => void;
  setDynamicUserBorrow: (value: number) => void;
}) => {
  const { dynamicUserCollateral, dynamicUserBorrow, refetchAll } =
    useReadLendingData(undefined, undefined, props.lpAddress as `0x${string}`);

  useEffect(() => {
    props.setDynamicUserCollateral(Number(dynamicUserCollateral));
    props.setDynamicUserBorrow(Number(dynamicUserBorrow));
  }, [dynamicUserCollateral, dynamicUserBorrow]);

  // Expose refetchAll to parent component
  useEffect(() => {
    if (props.setLpAddress) {
      props.setLpAddress(props.lpAddress);
    }
  }, [props.lpAddress]);

  return (
    <div className="flex items-center gap-2 py-2">
      <CircleDollarSign className="h-5 w-5 text-blue-600" />
      <CardTitle className="text-xl text-gray-800 w-full">
        <div className="flex items-center gap-1">
          <div>Lending Pool</div>
          <div className="flex items-center gap-2 ml-4">
            <Select
              value={props.lpAddress}
              onValueChange={(value) => {
                props.setLpAddress(value);
                refetchAll();
              }}
            >
              <AnimatePresence>
                <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.8 }}
                >
                  <SelectTrigger className="w-full bg-white text-gray-800 border border-gray-300 hover:border-gray-400 focus:ring-2 focus:ring-emerald-200 rounded-lg shadow-sm cursor-pointer">
                    <SelectValue placeholder="Select a collateral token" />
                  </SelectTrigger>
                </motion.div>
              </AnimatePresence>
              <AnimatePresence>
                <SelectContent className="bg-white border border-gray-300 rounded-lg shadow-md">
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5, ease: "easeIn" }}
                  >
                    <SelectGroup>
                      <SelectLabel className="text-gray-700 font-semibold px-3 pt-2">
                        Collateral Token
                      </SelectLabel>
                      {props.lpData.map((lp) => (
                        <SelectItem
                          key={lp.id}
                          value={String(lp.lpAddress)}
                          className="cursor-pointer px-3 py-2 text-sm text-gray-800 hover:bg-emerald-50 transition-colors flex items-center gap-2"
                        >
                          <Image
                            src={props.findLogoToken(lp.collateralToken) ?? ""}
                            alt={props.findNameToken(lp.collateralToken) ?? ""}
                            width={20}
                            height={20}
                          />
                          {props.findNameToken(lp.collateralToken)} -
                          <Image
                            src={props.findLogoToken(lp.borrowToken) ?? ""}
                            alt={props.findNameToken(lp.borrowToken) ?? ""}
                            width={20}
                            height={20}
                          />
                          {props.findNameToken(lp.borrowToken)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </motion.div>
                </SelectContent>
              </AnimatePresence>
            </Select>
          </div>
        </div>
      </CardTitle>
    </div>
  );
};

export default CollateralSection;
