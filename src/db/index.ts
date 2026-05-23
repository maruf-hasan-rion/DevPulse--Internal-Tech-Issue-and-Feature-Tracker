import { neon } from "@neondatabase/serverless";
import { config } from "../config";
import { createSchema } from "./schema";

export const sql = neon(config.database_url);

export const initDB = async () => {
  try {
    await createSchema();
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
};
