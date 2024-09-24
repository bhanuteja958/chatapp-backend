import { CookieOptions, Request, Response, Router } from "express";
import {
    createUser,
    loginUser,
    userDetails,
} from "../controllers/user.controller";
import { createResponse } from "../common/helper";
import { authMiddleWare } from "../middlewares/auth.middleware";

const userRouter: Router = Router();

userRouter.post("/register", async (req: Request, res: Response) => {
    try {
        const { status, response } = await createUser(req);
        res.status(status).json(response);
    } catch (error) {
        res.status(500).json(createResponse(false, "something went wrong"));
    }
});

userRouter.post("/login", async (req: Request, res: Response) => {
    try {
        const { status, response, token } = await loginUser(req);
        const cookieOptions: CookieOptions = {
            domain: "localhost",
            httpOnly: true,
            path: "/",
            sameSite: "lax",
        };
        res.cookie("access_token", token, cookieOptions)
            .status(status)
            .json(response);
    } catch (error) {
        res.status(500).json(createResponse(false, "something went wrong"));
    }
});

userRouter.get(
    "/details",
    authMiddleWare,
    async (req: Request, res: Response) => {
        try {
            const { status, response } = await userDetails(req);
            res.status(status).json(response);
        } catch (error) {
            res.status(500).json(createResponse(false, "something went wrong"));
        }
    }
);

export default userRouter;
