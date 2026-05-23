import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

export const config = {
  database_url: process.env.DATABASE_URL as string,
  port: process.env.PORT as string,
  node_env: process.env.NODE_ENV as string,
};
