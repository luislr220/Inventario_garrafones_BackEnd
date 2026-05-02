class AppError extends Error {
  constructor(mensaje, statusCode) {
    super(mensaje);

    this.statusCode = statusCode;
    this.exito = false;

    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
