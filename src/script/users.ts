import { db } from "../config/auth_db";

const TABLE_NAME = "users";

const createUsersTableQuery = `
  CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    age INT,
    gender VARCHAR(20)
  );
`;

const columnsToEnsure = [
  { name: "id", sql: "id SERIAL" },
  { name: "name", sql: "name VARCHAR(100) NOT NULL" },
  { name: "email", sql: "email VARCHAR(150) UNIQUE NOT NULL" },
  { name: "password", sql: "password TEXT NOT NULL" },
  { name: "age", sql: "age INT" },
  { name: "gender", sql: "gender VARCHAR(20)" },
];

async function tableExists() {
  const result = await db.query(
    `SELECT EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = $1
    ) AS "exists"`,
    [TABLE_NAME],
  );

  return Boolean(result.rows?.[0]?.exists);
}

async function getExistingColumns() {
  const result = await db.query(
    `SELECT column_name
     FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = $1`,
    [TABLE_NAME],
  );

  return new Set(result.rows.map((row) => row.column_name as string));
}

async function ensurePrimaryKey() {
  const result = await db.query(
    `SELECT EXISTS (
      SELECT 1
      FROM pg_constraint
      WHERE conrelid = $1::regclass
        AND contype = 'p'
    ) AS "exists"`,
    [TABLE_NAME],
  );

  const hasPrimaryKey = Boolean(result.rows?.[0]?.exists);
  if (!hasPrimaryKey) {
    await db.query(`ALTER TABLE ${TABLE_NAME} ADD PRIMARY KEY (id);`);
    console.log("Primary key added on id.");
  }
}

async function ensureUsersTable() {
  const exists = await tableExists();

  if (!exists) {
    await db.query(createUsersTableQuery);
    console.log(`Table "${TABLE_NAME}" created.`);
    return;
  }

  const existingColumns = await getExistingColumns();

  for (const column of columnsToEnsure) {
    if (!existingColumns.has(column.name)) {
      await db.query(`ALTER TABLE ${TABLE_NAME} ADD COLUMN ${column.sql};`);
      console.log(`Column "${column.name}" added.`);
    }
  }

  await ensurePrimaryKey();
  console.log(`Table "${TABLE_NAME}" checked and updated if needed.`);
}

ensureUsersTable()
  .then(() => {
    console.log("Done.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to ensure users table:", error);
    process.exit(1);
  });
