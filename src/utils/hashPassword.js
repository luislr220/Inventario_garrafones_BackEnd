const bcrypt = require("bcrypt");
const AppError = require("./appError");

const salt_rounds = 12;

async function passwordHash(password) {
  try {
    if (!password || typeof password !== "string") {
      throw new AppError(
        "La contraseña es requerida y debe ser una cadena de texto.",
      );
    }

    const salt = await bcrypt.genSalt(salt_rounds);

    const passwordConHash = await bcrypt.hash(password, salt);

    console.log("CONTRASEÑA ORIGINAL: " + password);
    console.log(`CONTRASEÑA CON HASH: ${passwordConHash}`);

    return passwordConHash;
  } catch (error) {
    throw new AppError(`Error al crear el hash: ${error.message}`);
  }
}

async function verifyPassword(password, passwordHash) {
  try {
    const result = bcrypt.compare(password, passwordHash);
    return result;
  } catch (error) {
    throw new AppError(
      `Error al verificar la contraseña: ${error.message}`,
      500,
    );
  }
}

module.exports = { passwordHash, verifyPassword };
