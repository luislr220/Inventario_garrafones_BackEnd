const { query } = require("../db/dbConfig");

const UserModel = {
  findAll: async () => {
    const result = await query("SELECT * FROM usuarios;");
    return result;
  },
};

module.exports = UserModel;
