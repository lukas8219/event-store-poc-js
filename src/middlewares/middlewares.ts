import { Request, Response } from "express";

export async function handleError(req: Request, res: Response, next: any) {
  try {
    return await next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "error occured",
    });
  }
}
