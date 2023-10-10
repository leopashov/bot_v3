import * as dotenv from "dotenv";
import { QuoteParams, SwapParams } from "../types/types";

dotenv.config();

if (!process.env.PRIVATE_KEY) {
  throw new Error("Private key is undefined");
}

export const PRIVATE_KEY: string[] = [
  process.env.PRIVATE_KEY,
  process.env.PRIVATE_KEY,
  process.env.PRIVATE_KEY,
  process.env.PRIVATE_KEY,
  process.env.PRIVATE_KEY,
];

export const RPC_URL = process.env.RPC_URL;
export const INFURA_API_KEY = process.env.INFURA_API_KEY;
export const ZEROX_API_KEY = process.env.ZEROX_API_KEY;
export const ZEROX_TEST_API_KEY = process.env.ZEROX_TEST_API_KEY;
export const SWAP_URL = "https://polygon.api.0x.org//swap/v1/quote?";

export const TELCOIN_CONTRACT_ADDRESS: string =
  "0xdF7837DE1F2Fa4631D716CF2502f8b230F1dcc32";
export const USDT_CONTRACT_ADDRESS: string =
  "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";

export const WEEKLY_PURCHASE_AMOUNT: bigint = BigInt(1000000); //8,400 USDT (6 decimals) 0.01
export const WEEKLY_NUMBER_OF_TRADES: number = 5; //168/week = 1 per hour
export const LOGGING_INTERVAL: number = 5000; //5 seconds
export const PRICE_IMPACT_WINDOW_LENGTH = { unit: "day", value: "-30" };

export const LOG_QUOTE: QuoteParams = {
  buyToken: USDT_CONTRACT_ADDRESS,
  sellToken: TELCOIN_CONTRACT_ADDRESS,
  buyAmount: String(WEEKLY_PURCHASE_AMOUNT / BigInt(WEEKLY_NUMBER_OF_TRADES)), // amount in BN
};

export const MAX_TRADE_SIZE: bigint = BigInt(
  Math.floor(Number(LOG_QUOTE.buyAmount) * 1.5)
);
export const MIN_TRADE_SIZE: bigint = BigInt(
  Math.floor(Number(LOG_QUOTE.buyAmount) * 0.5)
);
