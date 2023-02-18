import { StudentUser, User } from "@interfaces/users.interface";
import { Request } from "./routes.interface";

export type TokenType = "access" | "refresh";

export interface DataStoredInToken {
  _id: string;
  tokenType: TokenType;
}

export interface TokenData {
  token: string;
  expiresIn: number | string;
}

export interface RequestWithUser extends Request {
  user: User;
}

export interface RequestWithStudentUser extends Request {
  user: StudentUser;
}

