export class ApiError extends Error {
    constructor({
        message = "something went wrong. Please, try again later",
        statusCode,
    }) {
        super(message);

        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor);
    }
}
