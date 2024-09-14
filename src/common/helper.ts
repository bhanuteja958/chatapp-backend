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
