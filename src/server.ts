import "dotenv/config";
import express, { Express, Request, Response } from "express";
import { pool } from "./connections/sqldb";
import cors from "cors";
import userRouter from "./routes/user.routes";

const app: Express = express();
const PORT: number = parseInt(process.env.PORT) || 3000;

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use((req: Request, res: Response, next: () => void) => {
    req.pool = pool;
    next();
});

app.use("/api/user", userRouter);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
