import { app } from "./app";
import { env } from "./config/env";
import { pool } from "./database/pool";

async function startServer(): Promise<void> {
  try {
    await pool.query("SELECT 1");

    app.listen(env.port, () => {
      console.log(`Server listening on port ${env.port}`);
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Unable to connect to PostgreSQL:", message);
    process.exit(1);
  }
}

void startServer();
