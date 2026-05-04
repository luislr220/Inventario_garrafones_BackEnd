const { randomInt } = require("node:crypto");
const AppError = require("./appError");

const secret2FA = () => {
  const secret = randomInt(100000, 999999);

  if (!secret) {
    throw new AppError("Ocurrio un error al generar el token.", 422);
  }

  return secret;
};
module.exports = { secret2FA };
