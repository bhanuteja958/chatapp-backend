import { Pool } from "mysql2/promise";

declare global {
    namespace Express {
        interface Request {
            pool?: Pool;
            userId?: string;
        }
    }

    interface iResponse {
        success: boolean;
        message: string;
        data: unknown;
    }
}
