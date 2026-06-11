import type { IUser } from "../modules/auth/auth.interface";

export type TRole = "contributor" | "maintainer";

export type TJwtPayload = Omit<IUser, "created_at" | "updated_at" | "password">;
