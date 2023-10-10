import { initializeDb, getDb } from "../src/services/database/databaseService";
import { TradeService } from "../src/services/database/tradeService";
import { PriceImpactService } from "../src/services/database/priceImpactService";
import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import { time, timeStamp } from "console";
import { Trade } from "../src/types/types";

let db: Database | null = null;
let priceImpactService: PriceImpactService;
let tradeService: TradeService;

beforeAll(async () => {
  // Use an in-memory database for testing
  //   db = await open({
  //     filename: ":memory:",
  //     driver: sqlite3.Database,
  //   });

  //   await db.exec(`CREATE TABLE IF NOT EXISTS price_impacts (
  //     id INTEGER PRIMARY KEY,
  //     priceImpact REAL NOT NULL,
  //     timestamp TEXT NOT NULL
  //   )`);

  //   console.log("Database initialized!");

  // Initialize and create tables
  db = await initializeDb();
  tradeService = new TradeService(db);
  priceImpactService = new PriceImpactService(db);
});

afterAll(async () => {
  // Ensure the database connection is closed after testing
  await db?.close();
});

describe("Price Impact Database Operations", () => {
  test("should initialise database", async () => {
    expect(db).toBeDefined();
  });
  test("should create tables", async () => {
    const row = await db?.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='price_impacts'"
    );
    expect(row).toBeDefined();
    expect(row.name).toBe("price_impacts");
  });

  test("should insert data into the database", async () => {
    const priceImpact = 0.01;
    const timestamp = new Date().toISOString();

    // Insert data
    await priceImpactService.insertPriceImpact(priceImpact, timestamp);

    // Validate insertion
    const impact = await priceImpactService.getLastPriceImpact();
    console.log("priceImpact: ", impact.priceImpact);
    console.log("timestamp: ", impact.timestamp);
    expect(impact.priceImpact).toEqual(priceImpact);
    expect(impact.timestamp).toBeDefined();
  });

  describe("getHistoricalPriceImpacts", () => {
    test("should retrieve historical price impacts", async () => {
      // Insert some dummy data to test retrieval
      const historicalPriceImpacts =
        await priceImpactService.getHistoricalPriceImpacts();
      expect(historicalPriceImpacts).toHaveLength(1);
      expect(historicalPriceImpacts[0]).toHaveProperty("priceImpact");
      expect(historicalPriceImpacts[0]).toHaveProperty("timestamp");
    });

    test("should retrieve historical price impacts in ascending order by id", async () => {
      const historicalPriceImpacts =
        await priceImpactService.getHistoricalPriceImpacts();
      expect(historicalPriceImpacts[0].priceImpact).toBe(0.01);
    });

    test("should get price impacts in window", async () => {
      const windowPriceImpacts =
        await priceImpactService.getPriceImpactsInWindow();
      expect(windowPriceImpacts).toBeDefined;
      expect(windowPriceImpacts).toHaveLength(1);
    });
  });
});

describe("Trade Database Operations", () => {
  test("should create tables", async () => {
    const row = await db?.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='trades'"
    );
    expect(row).toBeDefined();
    expect(row.name).toBe("trades");
  });

  test("should insert data into the database", async () => {
    const trade: Trade = {
      Price: 1000,
      grossBuyAmount: String(BigInt(1000)),
      grossSellAmount: String(BigInt(20000)),
      buyAmount: String(BigInt(1000)),
      sellAmount: String(BigInt(20000)),
      gasPrice: String(BigInt(5678)),
      timestamp: new Date().toISOString(),
      priceImpact: 0.01,
    };

    // Insert data
    await tradeService.insertTrade(trade);

    // Validate insertion
    const tradeRow = await tradeService.getLastTrade();
    console.log("trade row: ", tradeRow);
    console.log("priceImpact: ", tradeRow.priceImpact);
    console.log("timestamp: ", tradeRow.gasPrice);
    expect(tradeRow.priceImpact).toEqual(trade.priceImpact);
    expect(String(tradeRow.gasPrice)).toEqual(trade.gasPrice);
  });

  test("should get trades from this week", async () => {
    // Insert some dummy data to test retrieval
    const tradesThisWeek = await tradeService.getTradesThisWeek();
    expect(tradesThisWeek).toHaveLength(1);
    expect(tradesThisWeek[0]).toHaveProperty("priceImpact");
    expect(tradesThisWeek[0]).toHaveProperty("timestamp");
  });

  test("should retrieve all trades in ascending order by id", async () => {
    const allTrades = await tradeService.getAllTrades();
    expect(allTrades[0].priceImpact).toBe(0.01);
  });
});
