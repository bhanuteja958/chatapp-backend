export const createResponse = (
    success: boolean,
    message: string = "",
    data: unknown = {}
) => {
    return {
        success,
        message,
        data,
    };
};

export const parseCookies = (cookieHeader: string) => {
    const cookies: any = {};

    if (cookieHeader) {
        const keyValues = cookieHeader.split(";");

        keyValues.forEach((keyValue: string) => {
            const [key, value]: string[] = keyValue
                .split("=")
                .map((part) => part.trim());

            cookies[key] = value;
        });
    }

    return cookies;
};
