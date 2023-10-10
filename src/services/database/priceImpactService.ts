import { Database } from "sqlite";
import { PriceImpactData } from "../../types/types";
import { PRICE_IMPACT_WINDOW_LENGTH } from "../../config/config";

export class PriceImpactService {
  constructor(private db: Database) {}

  async insertPriceImpact(
    priceImpact: number,
    timestamp: string
  ): Promise<void> {
    await this.db.run(
      `INSERT INTO price_impacts (priceImpact, timestamp) VALUES (?, ?)`,
      [priceImpact, timestamp]
    );
  }

  async getHistoricalPriceImpacts(): Promise<PriceImpactData[]> {
    return await this.db.all(`SELECT * FROM price_impacts`);
  }

  async getPriceImpactsInWindow() {
    try {
      console.log(
        `price impacts window call: ${PRICE_IMPACT_WINDOW_LENGTH.value} ${PRICE_IMPACT_WINDOW_LENGTH.unit}`
      );
      const priceImpacts = await this.db.all(
        `SELECT * FROM price_impacts WHERE timestamp >= datetime('now', ?)`,
        `${PRICE_IMPACT_WINDOW_LENGTH.value} ${PRICE_IMPACT_WINDOW_LENGTH.unit}`
      );
      return priceImpacts;
    } catch (error) {
      console.error("Error retrieving price impacts:", error);
      return [];
    }
  }
  async getLastPriceImpact(): Promise<PriceImpactData> {
    const impact = await this.db.get(
      `SELECT * FROM price_impacts ORDER BY id DESC LIMIT 1`
    );
    if (impact !== null) {
      return impact;
    } else {
      throw new Error("tradeService: getLastTrade() returned null");
    }
  }
}
