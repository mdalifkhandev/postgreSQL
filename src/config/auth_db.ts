import { Pool } from "pg";
import { config } from ".";

const pool = new Pool({
  host: config.host,
  port: config.db_port,
  database: config.name,
  user: config.user,
  password: config.password,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on("error", (err) => {
  console.log("Unexpected DB Error");
});

export const db = {
  query: (text: string, params?: unknown[]) => pool.query(text, params),
  connect: async () => {
    const client = await pool.connect();
    client.release();
    console.log("Database connected");
  },
};
