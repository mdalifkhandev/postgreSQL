import { db } from "../../config/auth_db";

type UserCreate = {
  name: string;
  email: string;
  password: string;
  age?: number;
  gender?: string;
};

const userCreatedSQL = async ({
  name,
  email,
  password,
  age,
  gender,
}: UserCreate) => {
  const result = await db.query(
    `
    INSERT INTO users(name,email,password,age,gender) VALUES ($1,$2,$3,$4,$5) RETURNING id,name,email,age,gender
    `,
    [name, email, password, age ?? null, gender ?? null],
  );

  return result.rows;
};

const allUserGetSQL = async () => {
  const result = await db.query(`SELECT * FROM users ORDER BY id DESC`);

  return result.rows;
};

export const authServises = {
  userCreatedSQL,
  allUserGetSQL,
};
