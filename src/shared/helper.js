const bcrypt = require("bcrypt");

const hash_password = async (password) => {
  const salt = 10;

  return await bcrypt.hash(password, salt);
};

const compare_password = async (password, userPassword) => {
  return await bcrypt.compare(password, userPassword);
};

module.exports = {
  hash_password,
  compare_password,
};
