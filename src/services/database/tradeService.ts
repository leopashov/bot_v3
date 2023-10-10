import { Database } from "sqlite";
import { Trade } from "../../types/types";

export class TradeService {
  constructor(private db: Database) {}

  async insertTrade(trade: Trade): Promise<void> {
    try {
      await this.db.run(
        `INSERT INTO trades (Price, grossBuyAmount, grossSellAmount, buyAmount, sellAmount, gasPrice, timestamp, priceImpact) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          trade.Price,
          trade.grossBuyAmount,
          trade.grossSellAmount,
          trade.buyAmount,
          trade.sellAmount,
          trade.gasPrice,
          trade.timestamp,
          trade.priceImpact,
        ]
      );
      console.log("Trade inserted to DB");
    } catch (error) {
      console.error("Error while inserting trade:", error);
    }
  }

  async getAllTrades(): Promise<any[]> {
    return await this.db.all(`SELECT * FROM trades`);
  }

  async getTradesThisWeek() {
    const oneWeekAgo = Date.now() - 7 * 24 * 3600 * 1000;

    const trades = await this.db.all(
      `
      SELECT * FROM trades
      WHERE timestamp >= ?
      ORDER BY timestamp DESC;
    `,
      oneWeekAgo
    );

    return trades || [];
  }
  async getLastTrade(): Promise<Trade> {
    const trade = await this.db.get(
      `SELECT * FROM trades ORDER BY id DESC LIMIT 1`
    );
    if (trade !== null) {
      return trade;
    } else {
      throw new Error("tradeService: getLastTrade() returned null");
    }
  }
}
