import {
  LOG_QUOTE,
  MAX_TRADE_SIZE,
  MIN_TRADE_SIZE,
  PRIVATE_KEY,
  SWAP_URL,
  TELCOIN_CONTRACT_ADDRESS,
  USDT_CONTRACT_ADDRESS,
  WEEKLY_NUMBER_OF_TRADES,
  WEEKLY_PURCHASE_AMOUNT,
} from "./config/config";
import { getLogQuote, getSwapQuote } from "./services/apiService";
import { initializeDb } from "./services/database/databaseService";
import { PriceImpactService } from "./services/database/priceImpactService";
import { TradeService } from "./services/database/tradeService";
import {
  determineNextTradeAmount,
  spentThisWeek,
} from "./services/sizingService";
import {
  calculateHistoricalPriceImpactMean,
  calculateHistoricalPriceImpactSigma,
  getMinAndMaxPriceImpact,
} from "./services/slippageService";
import { signAndSendSwap } from "./services/swapService";
import { getProvider, getSignerFromPK } from "./services/walletService";
import { SwapParams, Trade } from "./types/types";

runSwap();

async function runSwap() {
  // get current slippage at average constant value
  console.log(LOG_QUOTE);
  // ** quotes return 400 error if 'taker' does not have enough tokens **
  const quote = await getLogQuote(LOG_QUOTE);
  console.log("quote: ", quote);
  // get current priceImpact
  console.log("expected price impact: ", quote.estimatedPriceImpact);
  // get historical price impacts
  const db = await initializeDb();
  // create new tradeservice
  const tradeService = new TradeService(db);

  // create new price impact service
  const priceImpactService = new PriceImpactService(db);

  const recentPriceImpacts = await priceImpactService.getPriceImpactsInWindow();
  // calculate mean historical price impact
  const meanHistoricalPriceImpact =
    calculateHistoricalPriceImpactMean(recentPriceImpacts); // ([]) price impacts

  const { minImpact, maxImpact } = getMinAndMaxPriceImpact(recentPriceImpacts);

  console.log(
    "next trade amount vars: budget: ",
    WEEKLY_PURCHASE_AMOUNT - (await spentThisWeek(tradeService)),
    "remaining trades: ",
    WEEKLY_NUMBER_OF_TRADES - (await tradeService.getTradesThisWeek()).length,
    "pi: ",
    Number(quote.estimatedPriceImpact),
    "pim: ",
    meanHistoricalPriceImpact,
    "pis: ",
    calculateHistoricalPriceImpactSigma(
      recentPriceImpacts,
      meanHistoricalPriceImpact
    ),
    "max impact: ",
    maxImpact,
    "minImpact: ",
    minImpact,
    "max trade size",
    MAX_TRADE_SIZE,
    "min trade size: ",
    MIN_TRADE_SIZE
  );

  // get amount to swap
  const amountToSwap = determineNextTradeAmount(
    WEEKLY_PURCHASE_AMOUNT - (await spentThisWeek(tradeService)),
    WEEKLY_NUMBER_OF_TRADES - (await tradeService.getTradesThisWeek()).length,
    Number(quote.estimatedPriceImpact),
    meanHistoricalPriceImpact,
    calculateHistoricalPriceImpactSigma(
      recentPriceImpacts,
      meanHistoricalPriceImpact
    ),
    maxImpact,
    minImpact,
    MAX_TRADE_SIZE,
    MIN_TRADE_SIZE
  );
  console.log("amount to swap: ", amountToSwap);
  // get provider
  const provider = await getProvider();
  // get signer
  const signer = await getSignerFromPK(provider, PRIVATE_KEY[0]);
  // get swap params
  const swapParameters: SwapParams = {
    buyToken: USDT_CONTRACT_ADDRESS,
    sellToken: TELCOIN_CONTRACT_ADDRESS,
    buyAmount: String(amountToSwap),
    takerAddress: signer.address,
  };
  // get quote
  const swapQuote = await getSwapQuote(swapParameters);
  console.log("swap quote: ", swapQuote);
  // sign and send quote
  const receipt = await signAndSendSwap(swapQuote, signer);
  console.log(receipt);
  // log swap within weekly window array
  if (receipt == null) {
    throw new Error("runSwap: null receipt");
  } else if (receipt.status == null) {
    throw new Error("RunSwap: null receipt status");
  } else {
    const trade: Trade = {
      Price: Number(swapQuote.price),
      grossBuyAmount: swapQuote.grossBuyAmount,
      grossSellAmount: swapQuote.grossSellAmount,
      buyAmount: swapQuote.buyAmount,
      sellAmount: swapQuote.sellAmount,
      gasPrice: swapQuote.gasPrice,
      timestamp: new Date().toISOString(),
      priceImpact: Number(swapQuote.estimatedPriceImpact),
    };

    tradeService.insertTrade(trade);
  }
}
