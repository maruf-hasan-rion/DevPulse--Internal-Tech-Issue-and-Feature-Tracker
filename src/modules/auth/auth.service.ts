import bcrypt from "bcrypt";
import { sql } from "./../../db/index";
import type { IUser } from "./auth.interface";

const createUserInDB = async (user: IUser) => {
  const { name, email, password, role } = user;

  const hashedPassword = await bcrypt.hash(password as string, Number(10));

  const result = await sql`
     INSERT INTO users (name, email,
     password, role)
     VALUES (${name}, ${email}, ${hashedPassword}, COALESCE(${role}, 'contributor'))
     RETURNING id, name, email, role, created_at, updated_at
   `;

  return result[0];
};

export const authService = {
  createUserInDB,
};
