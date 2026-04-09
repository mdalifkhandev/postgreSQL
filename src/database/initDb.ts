import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { pool } from "./pool";
import { env } from "../config/env";

async function initDb(): Promise<void> {
  const client = await pool.connect();

  try {
    const sqlPath = path.join(__dirname, "..", "..", "sql", "init.sql");
    const schemaSql = fs.readFileSync(sqlPath, "utf8");

    await client.query("BEGIN");
    await client.query(schemaSql);

    if (env.admin.email && env.admin.password) {
      const passwordHash = await bcrypt.hash(env.admin.password, 10);

      await client.query(
        `
          INSERT INTO users (name, email, password_hash, role)
          VALUES ($1, $2, $3, 'admin')
          ON CONFLICT (email)
          DO UPDATE SET
            name = EXCLUDED.name,
            password_hash = EXCLUDED.password_hash,
            role = 'admin',
            updated_at = CURRENT_TIMESTAMP;
        `,
        [env.admin.name, env.admin.email.toLowerCase(), passwordHash]
      );
    }

    await client.query("COMMIT");
    console.log("Database initialized successfully.");
  } catch (error) {
    await client.query("ROLLBACK");
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Database initialization failed:", message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

void initDb();
