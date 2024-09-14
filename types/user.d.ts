export interface iRegisterPayload {
    fullName: string;
    email: string;
    password: string;
    dateOfBirth: string;
}

export interface iLoginPayload {
    email: string;
    password: string;
}
