import { Request } from "express";
import { LOGIN_SCHEMA, REGISTER_SCHEMA } from "../schemas/user.schema";
import { iLoginPayload, iRegisterPayload } from "../../types/user";
import { compare, hash } from "bcrypt";
import {
    checkIfUserAlreadyExists,
    getUserPasswordHash,
    insertUser,
} from "../services/user.service";
import { createResponse } from "../common/helper";
import { sign } from "jsonwebtoken";

const SALT_ROUNDS = 5;

export const createUser = async (req: Request) => {
    try {
        const payload: iRegisterPayload = req.body;
        REGISTER_SCHEMA.isValid(payload);

        const userExists: boolean = await checkIfUserAlreadyExists(
            req.pool,
            payload.email
        );

        if (userExists) {
            return {
                status: 400,
                response: createResponse(false, "User already exists"),
            };
        } else {
            const hashedPassword = await hash(payload.password, SALT_ROUNDS);
            payload.password = hashedPassword;

            await insertUser(req.pool, payload);
            return {
                status: 200,
                response: createResponse(true, "Successfully created user"),
            };
        }
    } catch (error) {
        throw error;
    }
};

export const loginUser = async (req: Request) => {
    try {
        const payload: iLoginPayload = req.body;
        LOGIN_SCHEMA.isValid(payload);

        const stored_password_hash = await getUserPasswordHash(
            req.pool,
            payload.email
        );

        if (!stored_password_hash) {
            return {
                status: 400,
                response: createResponse(
                    false,
                    "User does not exist with the given email"
                ),
            };
        }

        const isValidPassword = await compare(
            payload.password,
            stored_password_hash
        );

        if (!isValidPassword) {
            return {
                status: 400,
                response: createResponse(false, "Not a correct password"),
            };
        }

        const access_token = sign(
            { email: payload.email },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: "1d" }
        );

        return {
            status: 200,
            response: createResponse(true, "successfully logged in"),
            token: access_token,
        };
    } catch (error) {
        throw error;
    }
};
