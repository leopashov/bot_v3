import {
  LOGGING_INTERVAL,
  LOG_QUOTE,
  PRIVATE_KEY,
  TELCOIN_CONTRACT_ADDRESS,
  USDT_CONTRACT_ADDRESS,
  WEEKLY_NUMBER_OF_TRADES,
  WEEKLY_PURCHASE_AMOUNT,
} from "../config/config";
import { SwapParams, SwapQuote } from "../types/types";
import { getLogQuote } from "./apiService"; // Assuming you have a separate module for API calls.

export function getLiveQuote(): SwapParams {
  const pkIndex = Math.floor(Math.random() * (PRIVATE_KEY.length + 1));
  return {
    buyToken: USDT_CONTRACT_ADDRESS,
    sellToken: TELCOIN_CONTRACT_ADDRESS,
    buyAmount: String(WEEKLY_PURCHASE_AMOUNT / BigInt(WEEKLY_NUMBER_OF_TRADES)),
    takerAddress: PRIVATE_KEY[pkIndex],
  };
}

export const logQuote = (quote: SwapQuote) => {
  console.log(quote);
  throw Error("not implemented yet");
  // Your logic to log the quote and maintain the rolling window statistics.
};

export const fetchQuotesForLogging = async () => {
  try {
    const quote = await getLogQuote(LOG_QUOTE);
    logQuote(quote);
  } catch (error) {
    console.error("Error fetching quote for logging:", error);
  } finally {
    setTimeout(fetchQuotesForLogging, LOGGING_INTERVAL);
  }
};
