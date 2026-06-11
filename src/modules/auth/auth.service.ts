import bcrypt from "bcrypt";
import { sql } from "./../../db/index";
import type { IUser } from "./auth.interface";
import { generateToken, verifyToken } from "../../utils/jwt";
import type { TJwtPayload } from "../../types";

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

const loginUser = async (email: string, password: string) => {
  const existingUser = await sql`
    SELECT id, name, email, password, role, created_at, updated_at
    FROM users
    WHERE email = ${email}
  `;

  if (existingUser.length === 0) {
    throw new Error("Invalid Credentials!");
  }

  const user = existingUser[0] as IUser & { password: string };

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid Credentials!");
  }

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword as TJwtPayload;
};

const generateRefreshToken = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new Error("Unauthorized");
  }
  const payload = verifyToken(refreshToken, "refresh") as TJwtPayload;

  if (!payload || !payload.email) {
    throw new Error("Invalid or expired refresh token");
  }
  const userData = await sql`
    SELECT id, name, email, role 
    FROM users 
    WHERE email = ${payload.email}
  `;

  if (userData.length === 0) {
    throw new Error("User not found!!");
  }
  const user = userData[0] as TJwtPayload;
  const { accessToken, refreshToken: newRefreshToken } = generateToken(user);

  return { accessToken, newRefreshToken, user };
};

export const authService = {
  createUserInDB,
  loginUser,
  generateRefreshToken,
};
