import { WEEKLY_NUMBER_OF_TRADES } from "../config/config";
import { Trade } from "../types/types";
import { TradeService } from "./database/tradeService";

// Function to check total spending in the window
export const spentThisWeek = async (
  tradeService: TradeService
): Promise<bigint> => {
  try {
    const trades = await tradeService.getTradesThisWeek();
    return trades.reduce(
      (sum: bigint, trade: any) => sum + BigInt(trade.sellAmount),
      BigInt(0)
    );
  } catch (error) {
    console.error("Error while calculating spent amount:", error);
    return BigInt(0); // Or handle error appropriately for your use case
  }
};

export function determineNextTradeAmount(
  remainingWeeklyBudget: bigint,
  remainingNumberOfTrades: number,
  currentPriceImpact: number,
  historicalPriceImpactMean: number,
  historicalPriceImpactSigma: number,
  maxImpact: number,
  minImpact: number,
  maxTradeSize: bigint,
  minTradeSize: bigint
): bigint {
  let baseAmount;
  if (remainingNumberOfTrades <= 0) {
    throw new Error("determineNextTradeAmount: no remaining trades this week");
  } else {
    baseAmount = remainingWeeklyBudget / BigInt(remainingNumberOfTrades);
  }

  // Scaling logic integrated into your existing function

  const zProportion = calculateZProportion(
    currentPriceImpact,
    historicalPriceImpactMean,
    historicalPriceImpactSigma,
    maxImpact,
    minImpact
  );
  console.log("cheeky val: ", zProportion);

  let scaledTradeSize =
    (BigInt(minTradeSize + maxTradeSize - minTradeSize) *
      BigInt(Math.floor(zProportion))) /
    BigInt(1000000);
  scaledTradeSize = bigIntMax(
    minTradeSize,
    bigIntMin(scaledTradeSize, maxTradeSize)
  );

  // Ensure you do not spend more than what's left in the budget
  return scaledTradeSize > remainingWeeklyBudget
    ? remainingWeeklyBudget
    : scaledTradeSize;
}

function calculateZProportion(
  currentPriceImpact: number,
  historicalPriceImpactMean: number,
  historicalPriceImpactSigma: number,
  maxImpact: number,
  minImpact: number
): number {
  if (historicalPriceImpactSigma == 0) {
    return 0.5 * 1000000;
  } else {
    const zScore =
      (currentPriceImpact - historicalPriceImpactMean) /
      historicalPriceImpactSigma;
    const zMax =
      (maxImpact - historicalPriceImpactMean) / historicalPriceImpactSigma;
    const zMin =
      (minImpact - historicalPriceImpactMean) / historicalPriceImpactSigma;
    return ((zScore - zMin) / (zMax - zMin)) * 1000000;
  }
}

function bigIntMax(a: bigint, b: bigint): bigint {
  return a > b ? a : b;
}

function bigIntMin(a: bigint, b: bigint): bigint {
  return a < b ? a : b;
}
