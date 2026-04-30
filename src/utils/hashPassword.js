const bcrypt = require("bcrypt");

const salt_rounds = 12;

async function passwordHash(password) {
  try {
    if (!password || typeof password !== "string") {
      throw new Error(
        "La contraseña es requerida y debe ser una cadena de texto.",
      );
    }

    const salt = await bcrypt.genSalt(salt_rounds);

    const passwordConHash = await bcrypt.hash(password, salt);

    console.log("CONTRASEÑA ORIGINAL: " + password);
    console.log(`CONTRASEÑA CON HASH: ${passwordConHash}`);

    return passwordConHash;
  } catch (error) {
    throw new Error(`Error al crear el hash: ${error.message}`);
  }
}

module.exports = { passwordHash };
