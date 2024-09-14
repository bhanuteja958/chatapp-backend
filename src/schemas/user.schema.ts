import { date, object, string } from "yup";

const PASSWORD_REGEX: RegExp =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+[\]{}|;:'",.<>?`~\\/-]).{8,20}$/;

export const REGISTER_SCHEMA = object({
    full_name: string().required().min(3).max(100),
    email: string().email().required(),
    password: string().matches(PASSWORD_REGEX),
    dateOfBirth: string().datetime().required(),
});

export const LOGIN_SCHEMA = object({
    email: string().email().required(),
    password: string().matches(PASSWORD_REGEX),
});
