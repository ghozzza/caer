import { Request, Response } from "express";
import { Address } from "viem";
import { BlockchainService } from "../services/blockchain.service";
import { BorrowRequest } from "../types";

const validateBorrowRequest = (req: Request): { isValid: boolean; error?: string } => {
  const { userAddress, amount } = req.body as BorrowRequest;

  if (!userAddress || !amount) {
    return {
      isValid: false,
      error: "Missing required parameters: userAddress and amount are required"
    };
  }

  if (!userAddress.startsWith("0x") || userAddress.length !== 42) {
    return {
      isValid: false,
      error: "Invalid user address format"
    };
  }

  if (isNaN(Number(amount)) || Number(amount) <= 0) {
    return {
      isValid: false,
      error: "Amount must be a positive number"
    };
  }

  return { isValid: true };
};

export const borrow = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = validateBorrowRequest(req);
    if (!validation.isValid) {
      res.status(400).json({
        success: false,
        message: validation.error
      });
      return;
    }

    const { userAddress, amount } = req.body as BorrowRequest;
    const txHash = await BlockchainService.executeBorrow(
      userAddress as Address,
      amount
    );

    res.status(200).json({
      success: true,
      message: "Borrow operation executed successfully",
      data: {
        transactionHash: txHash,
        userAddress: userAddress as Address,
        amount,
      },
    });
  } catch (error: any) {
    console.error("API Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to execute borrow operation",
      error: error.message,
    });
  }
}; 