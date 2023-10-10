import { PriceImpactData } from "../types/types";

export function calculateHistoricalPriceImpactMean(
  priceImpacts: PriceImpactData[]
): number {
  console.log(
    "calculateHistoricalPriceImpactMean Price impact data:",
    priceImpacts
  );
  const sum = priceImpacts.reduce((acc, data) => acc + data.priceImpact, 0);
  return sum / priceImpacts.length;
}

export function calculateHistoricalPriceImpactSigma(
  priceImpacts: PriceImpactData[],
  meanPriceImpact: number
): number {
  const squaredDiffSum = priceImpacts.reduce(
    (acc, data) => acc + Math.pow(data.priceImpact - meanPriceImpact, 2),
    0
  );
  const variance = squaredDiffSum / priceImpacts.length;
  return Math.sqrt(variance);
}

export function getMinAndMaxPriceImpact(data: PriceImpactData[]): {
  minImpact: number;
  maxImpact: number;
} {
  return data.reduce(
    ({ minImpact, maxImpact }, { priceImpact }) => ({
      minImpact: Math.min(minImpact, priceImpact),
      maxImpact: Math.max(maxImpact, priceImpact),
    }),
    {
      minImpact: Infinity, // Initially set to Infinity to ensure any number will be smaller
      maxImpact: -Infinity, // Initially set to -Infinity to ensure any number will be larger
    }
  );
}
