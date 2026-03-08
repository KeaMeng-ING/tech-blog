import { NextFunction, Request, Response } from "express";

export const validateRequest = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const validated = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!validated.success) {
      const fieldErrors = validated.error.flatten().fieldErrors;
      const flatErrors = Object.values(fieldErrors).flat();
      return res.status(400).json({ status: "error", message: flatErrors });
    }

    next();
  };
};
