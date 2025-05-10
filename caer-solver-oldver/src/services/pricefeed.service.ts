import { mockWbtc } from "../../constants/address";
import { config } from "../config";
import { BlockchainService } from "./blockchain.service";

export class PriceFeedService {
  static async fetchPrice(tokenName: string): Promise<number> {
    try {
      const response = await fetch(
        `https://min-api.cryptocompare.com/data/price?fsym=${tokenName}&tsyms=USD`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.USD;
    } catch (error) {
      console.error("Fetch error: ", error);
      throw error;
    }
  }

  static async updatePriceFeed(): Promise<void> {
    const token = config.TOKENS.options.find(
      (token) => token.address === config.TOKENS.mockWeth
    );
    const token2 = config.TOKENS.options.find(
      (token) => token.address === mockWbtc
    );


    if (!token) {
      throw new Error("Token not found in configuration");
    }

    if (!token2) {
      throw new Error("Token not found in configuration");
    }

    try {
      const price = await this.fetchPrice(token.namePrice);
      await BlockchainService.updatePriceFeed(
        token.namePrice,
        config.TOKENS.mockWeth,
        price,
        token.decimals
      );
      const price2 = await this.fetchPrice(token2.namePrice);
      await BlockchainService.updatePriceFeed(
        token2.namePrice,
        mockWbtc,
        price2,
        token2.decimals
      );
    } catch (error) {
      console.error("Error updating price feed:", error);
      throw error;
    }
  }
}
