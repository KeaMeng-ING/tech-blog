import jwt, { type SignOptions } from "jsonwebtoken";

const SECRET = process.env.BLOG_JWT_SECRET!;

export const signToken = (payload: object) => {
  const options: SignOptions = {
    expiresIn: (process.env.BLOG_JWT_EXPIRES_IN as SignOptions["expiresIn"]) ?? "7d",
  };
  return jwt.sign(payload, SECRET, options);
};

export const verifyToken = (token: string) => jwt.verify(token, SECRET);
