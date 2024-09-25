import "dotenv/config";
import express, { Express, Request, Response } from "express";
import { pool } from "./connections/sqldb";
import cors from "cors";
import userRouter from "./routes/user.routes";
import cookieParser from "cookie-parser";
import { WebSocket, WebSocketServer } from "ws";
import { createServer, IncomingMessage, Server } from "http";
import internal from "stream";
import { JwtPayload, verify, VerifyErrors } from "jsonwebtoken";
import { parseCookies } from "./common/helper";

const app: Express = express();
const server: Server = createServer(app);
const PORT: number = parseInt(process.env.PORT) || 3000;

app.use(cors({ origin: "*" }));
app.use(cookieParser());
app.use(express.json());

app.use((req: Request, res: Response, next: () => void) => {
    req.pool = pool;
    next();
});

app.use("/api/v1/user", userRouter);

app.on("upgrade", () => {});

const wss = new WebSocketServer({
    noServer: true,
    path: "/chat",
});

wss.on("connection", (socket: WebSocket, req: IncomingMessage) => {
    socket.on("message", (message) => {
        socket.send(`Echo ${message}`);
    });

    socket.on("close", () => {
        console.log("connection closed");
    });
});

server.on(
    "upgrade",
    (req: IncomingMessage, socket: internal.Duplex, head: Buffer) => {
        if (req.url === "/chat") {
            const cookies = parseCookies(req.headers["cookie"]);
            const token = cookies.access_token;
            if (!token) {
                socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
                socket.destroy();
                return;
            }

            verify(
                token,
                process.env.JWT_ACCESS_SECRET,
                (err: VerifyErrors, decoded: JwtPayload) => {
                    if (err) {
                        console.log(err);
                        socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
                        socket.destroy();
                        return;
                    }

                    wss.handleUpgrade(
                        req,
                        socket,
                        head,
                        (ws: WebSocket, req: IncomingMessage) => {
                            wss.emit("connection", ws, req);
                        }
                    );
                }
            );
        } else {
            socket.destroy();
        }
    }
);
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
