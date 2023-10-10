export type QuoteParams = {
  buyToken: string;
  sellToken: string;
  buyAmount: string; // amount in BN
};

export type SwapParams = {
  buyToken: string;
  sellToken: string;
  buyAmount: string; // amount in BN
  takerAddress: string;
};

export type SwapQuote = {
  chainId: number;
  price: string;
  guaranteedPrice: string;
  estimatedPriceImpact: string;
  to: string;
  data: string;
  value: string;
  gas: string;
  estimatedGas: string;
  gasPrice: string;
  protocolFee: string;
  minimumProtocolFee: string;
  buyTokenAddress: string;
  sellTokenAddress: string;
  buyAmount: string;
  sellAmount: string;
  sources: Array<{
    name: string;
    proportion: string;
  }>;
  orders: Array<{
    type: number;
    source: string;
    makerToken: string;
    takerToken: string;
    makerAmount: string;
    takerAmount: string;
    fillData: object; // Adjust if you have a known structure for fillData
    fill: object; // Adjust if you have a known structure for fill
  }>;
  allowanceTarget: string;
  decodedUniqueId: string;
  sellTokenToEthRate: string;
  buyTokenToEthRate: string;
  fees: {
    zeroExFee: null | any; // Adjust 'any' if you know the exact type for zeroExFee when not null
  };
  grossPrice: string;
  grossBuyAmount: string;
  grossSellAmount: string;
  auxiliaryChainData: object; // Adjust if you have a known structure for auxiliaryChainData
  expectedSlippage: null | any; // Adjust 'any' if you know the exact type for expectedSlippage when not null
};

export type Trade = {
  Price: number;
  grossBuyAmount: string;
  grossSellAmount: string;
  buyAmount: string;
  sellAmount: string;
  gasPrice: string;
  timestamp: string;
  priceImpact: number;
};

export type PriceImpactData = {
  priceImpact: number;
  timestamp: number; // Unix timestamp when the data was collected
};
