const prisma = require("./prisma-client");
const { hash_password, compare_password } = require("./helper");
module.exports = {
  prisma,
  hash_password,
  compare_password,
};
