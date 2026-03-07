import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";

export interface RequestWithUser extends Request {
  user?: any;
}

interface DecodedToken {
  id: string;
}

export const userAuthorize = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  // Check if token exists
  if (!token) {
    return res
      .status(401)
      .json({ status: "error", message: "Not authorized, token failed" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as unknown as DecodedToken;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true, isDisabled: true },
    });

    // If user not found
    if (!user) {
      return res
        .status(401)
        .json({ status: "error", message: "User no longer exists" });
    }

    // Grant access
    req.user = user;

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ status: "error", message: "Not authorized, token failed" });
  }
};
