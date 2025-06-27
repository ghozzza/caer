import { chains } from "@/constants/chain-address";
import { useAccount, useReadContract } from "wagmi";
import { poolAbi } from "@/lib/abis/poolAbi";
import { Address } from "viem";
import { tokens } from "@/constants/token-address";

const lendingPool = chains[1].contracts.lendingPool as `0x${string}`;
const { address } = useAccount();