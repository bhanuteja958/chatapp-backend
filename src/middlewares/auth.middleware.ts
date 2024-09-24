import { NextFunction, Request, Response } from "express";
import {
    JsonWebTokenError,
    JwtPayload,
    NotBeforeError,
    TokenExpiredError,
    verify,
    VerifyErrors,
} from "jsonwebtoken";
import { createResponse } from "../common/helper";

export const authMiddleWare = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const accessToken: string = req.cookies.access_token;
        const decoded: string | JwtPayload = verify(
            accessToken,
            process.env.JWT_ACCESS_SECRET
        ) as JwtPayload;

        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.log(error);
        if (
            error instanceof JsonWebTokenError ||
            error instanceof NotBeforeError ||
            error instanceof TokenExpiredError
        ) {
            return res
                .status(401)
                .json(createResponse(false, "You are Unauthorized"));
        }
        res.status(500).json(createResponse(false, "Something went wrong"));
    }
};
