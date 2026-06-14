import type { TJwtPayload } from ".";

declare global {
  namespace Express {
    interface Request {
      user?: TJwtPayload;
    }
  }
}

export {};
