import express from "express";
import { Address, createWalletClient, http, parseUnits } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import dotenv from "dotenv";
import { arbitrumSepolia } from "./chains";
import { lendingPoolAbi } from "../abi/lendingPoolAbi";
import { arbitrumContract } from "./contracts";
import { BorrowRequest } from "./types";
import cron from "node-cron";
import { config } from "./config";
import routes from "./routes";
import { PriceFeedService } from "./services/pricefeed.service";
import { BlockchainService } from "./services/blockchain.service";

dotenv.config();

// Initialize express app
const app = express();
app.use(express.json());

// Setup Wallet Client
const account = privateKeyToAccount(
  process.env.WALLET_PRIVATE_KEY as `0x${string}`
);

const arbitrumClient = createWalletClient({
  chain: arbitrumSepolia,
  transport: http("https://sepolia-rollup.arbitrum.io/rpc"),
  account,
});

/**
 * Execute borrow operation
 * @param {Address} user - User address
 * @param {string} amount - Amount to borrow in USDC
 * @returns {Promise<`0x${string}`>} - Transaction hash
 */
async function executeBorrow(
  user: Address,
  amount: string
): Promise<`0x${string}`> {
  console.log(
    `🔹 Executing borrow for ${user} on Ca Chain with ${amount} USDC`
  );

  try {
    // Convert USDC to correct format (6 decimals)
    const amountParsed = parseUnits(amount, 6);

    // Send transaction to smart contract
    const tx = await arbitrumClient.writeContract({
      address: arbitrumContract,
      abi: lendingPoolAbi,
      functionName: "borrowBySequencer",
      args: [amountParsed, user],
    });

    console.log(`✅ Borrow transaction executed: ${tx}`);
    return tx;
  } catch (error) {
    console.error("❌ Borrow execution failed:", error);
    throw error;
  }
}

// API Routes - Using the correct method to define routes
app.post("/api/borrow", (req, res) => {
  (async () => {
    try {
      const { userAddress, amount } = req.body as BorrowRequest;

      // Validate input
      if (!userAddress || !amount) {
        return res.status(400).json({
          success: false,
          message:
            "Missing required parameters: userAddress and amount are required",
        });
      }

      // Validate user address
      if (!userAddress.startsWith("0x") || userAddress.length !== 42) {
        return res.status(400).json({
          success: false,
          message: "Invalid user address format",
        });
      }

      // Validate amount
      if (isNaN(Number(amount)) || Number(amount) <= 0) {
        return res.status(400).json({
          success: false,
          message: "Amount must be a positive number",
        });
      }

      // Execute borrow operation
      const txHash = await executeBorrow(userAddress as Address, amount);

      // Return success response
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
  })();
});

// Health check endpoint - Using the correct method to define routes
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Use routes
app.use(routes);

// Start server
const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// // Add timeout function before the cron schedule
// const timeout = (ms: number) =>
//   new Promise((_, reject) =>
//     setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms)
//   );

// // Schedule price feed updates every minute
// cron.schedule("* * * * *", async () => {
//   try {
//     const price1 = await PriceFeedService.fetchPrice(
//       config.TOKENS.options[0].namePrice
//     );
//     const price2 = await PriceFeedService.fetchPrice(
//       config.TOKENS.options[1].namePrice
//     );
//     const price3 = await PriceFeedService.fetchPrice(
//       config.TOKENS.options[2].namePrice
//     );
//     const price4 = await PriceFeedService.fetchPrice(
//       config.TOKENS.options[3].namePrice
//     );
//     const price5 = await PriceFeedService.fetchPrice(
//       config.TOKENS.options[4].namePrice
//     );

//     // Update price feeds with timeout
//     await Promise.race([
//       BlockchainService.updatePriceFeed(
//         config.TOKENS.options[0].namePrice,
//         config.TOKENS.options[0].address,
//         price1,
//         config.TOKENS.options[0].decimals
//       ),
//       timeout(30000),
//     ]);
//     await Promise.race([
//       BlockchainService.updatePriceFeed(
//         config.TOKENS.options[1].namePrice,
//         config.TOKENS.options[1].address,
//         price2,
//         config.TOKENS.options[1].decimals
//       ),
//       timeout(30000),
//     ]);
//     await Promise.race([
//       BlockchainService.updatePriceFeed(
//         config.TOKENS.options[2].namePrice,
//         config.TOKENS.options[2].address,
//         price3,
//         config.TOKENS.options[2].decimals
//       ),
//       timeout(30000),
//     ]);

//     await Promise.race([
//       BlockchainService.updatePriceFeed(
//         config.TOKENS.options[3].namePrice,
//         config.TOKENS.options[3].address,
//         price4,
//         config.TOKENS.options[3].decimals
//       ),
//       timeout(30000),
//     ]);

//     await Promise.race([
//       BlockchainService.updatePriceFeed(
//         config.TOKENS.options[4].namePrice,
//         config.TOKENS.options[4].address,
//         price5,
//         config.TOKENS.options[4].decimals
//       ),
//       timeout(30000),
//     ]);

//     console.log("✅ Price feed updated successfully");
//   } catch (error) {
//     console.error("Error in scheduled price feed update:", error);
//   }
// });

export default app;
