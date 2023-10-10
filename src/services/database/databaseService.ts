import { open, Database } from "sqlite";
import sqlite3 from "sqlite3";
import { handleError } from "../handleError";
import { PriceImpactData } from "../../types/types";

let db: Database | null = null;

export async function initializeDb(): Promise<Database> {
  try {
    db = await open({
      filename: "./database.db",
      driver: sqlite3.Database,
    });

    await db.exec(`
    CREATE TABLE IF NOT EXISTS price_impacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      priceImpact REAL,
      timestamp TEXT
    );
    
    CREATE TABLE IF NOT EXISTS trades (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      Price STRING,
      grossBuyAmount STRING,
      grossSellAmount STRING,
      buyAmount STRING,
      sellAmount STRING,
      gasPrice STRING,
      timestamp TEXT,
      priceImpact INTEGER
  );
  `);

    console.log("Database tables initialized!");
  } catch (err) {
    handleError(err, "Failed to connect to database");
  }
  if (db !== null) {
    return db;
  } else {
    throw new Error("database null");
  }
}

export function getDb() {
  if (!db) {
    throw new Error("Database not initialized. Call initializeDb first.");
  }
  return db;
}
