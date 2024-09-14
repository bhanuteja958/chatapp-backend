import { Pool } from "mysql2/promise";

declare global {
    namespace Express {
        interface Request {
            pool?: Pool;
        }
    }

    interface iResponse {
        success: boolean;
        message: string;
        data: unknown;
    }
}
