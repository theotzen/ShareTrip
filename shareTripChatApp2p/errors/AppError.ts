class AppError extends Error {
    isOperational: boolean;
    code: any;

    constructor(message, code) {
    super(message)
        this.code = code;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor); 
    }
}

module.exports = AppError;