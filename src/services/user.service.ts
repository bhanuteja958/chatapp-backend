import {
    FieldPacket,
    Pool,
    QueryResult,
    ResultSetHeader,
    RowDataPacket,
} from "mysql2/promise";
import { iRegisterPayload } from "../../types/user";

export const insertUser = async (pool: Pool, userData: iRegisterPayload) => {
    try {
        const query: string =
            "INSERT INTO userS (full_name, email, password_hash, date_of_birth) values (?,?,?,?)";
        const placeHolderValues: string[] = [
            userData.fullName,
            userData.email,
            userData.password,
            userData.dateOfBirth,
        ];
        const [result]: [ResultSetHeader, FieldPacket[]] = await pool.query(
            query,
            placeHolderValues
        );
        return result.insertId;
    } catch (error) {
        throw error;
    }
};

export const checkIfUserAlreadyExists = async (pool: Pool, email: string) => {
    try {
        const query: string = "SELECT user_id from users where email = ?";
        const placeHolderValues: string[] = [email];
        const [result]: [RowDataPacket[], FieldPacket[]] = await pool.query(
            query,
            placeHolderValues
        );
        return result.length > 0;
    } catch (error) {
        throw error;
    }
};

export const getUserPasswordHash = async (pool: Pool, email: string) => {
    try {
        const query: string = "SELECT password_hash from users where email=?";
        const placeHolderValues: string[] = [email];
        const [result]: [RowDataPacket[], FieldPacket[]] = await pool.query(
            query,
            placeHolderValues
        );
        return result.length > 0 ? result[0].password_hash : "";
    } catch (error) {
        throw error;
    }
};

export const getUserId = async (pool: Pool, email: string) => {
    try {
        const query: string = "SELECT user_id from users where email=?";
        const placeHolderValues: string[] = [email];
        const [result]: [RowDataPacket[], FieldPacket[]] = await pool.query(
            query,
            placeHolderValues
        );
        return result.length > 0 ? result[0].user_id : "";
    } catch (error) {
        throw error;
    }
};

export const getUserDetails = async (pool: Pool, userId: string) => {
    try {
        const query: string =
            "SELECT user_id, email, date_of_birth, full_name, profile_pic, verified from users where user_id = ?";
        const placeHolderValues = [userId];
        const [result]: [RowDataPacket[], FieldPacket[]] = await pool.query(
            query,
            placeHolderValues
        );
        return result.length > 0 ? result[0] : {};
    } catch (error) {
        throw error;
    }
};
