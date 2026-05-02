const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    exito: false,
    mensaje: err.message || "Ocurrio un error, intentalo más tarde.",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = globalErrorHandler;
