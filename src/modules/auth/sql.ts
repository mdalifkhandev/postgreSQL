import bcrypt from "bcryptjs";
import { db } from "../../config/auth_db";

const authCreated = {
  createUser: async (paylode: {
    name: string;
    email: string;
    password: string;
    age?: number;
    gender?: string;
  }) => {
    const hashPassword = await bcrypt.hash(paylode.password, 10);
    const result = await db.query(
      `
            INSERT INTO users (name,email,password,age,gender)
            VALUES ($1,$2,$3,$4,$5)
            RETURING id, name email,age,gender
            `,
      [
        paylode.name,
        paylode.email,
        paylode.age ?? null,
        hashPassword,
        paylode.gender ?? null,
      ],
    );
    return result.rows[0];
  },

  getUserByEmail: async (email: string) => {
    const result = await db.query(
      `
        SELECT id,name,email,password,age,gender FROM users WHERE email=$1
        `,
      [email],
    );
    return result.rows[0];
  },
};

export default authCreated;
