const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} = require("@config/env.config");
const hash_password = async (password) => {
  const salt = 10;

  return await bcrypt.hash(password, salt);
};

const compare_password = async (password, userPassword) => {
  return await bcrypt.compare(password, userPassword);
};

const create_user_session = (req, user) => {
  req.session.user = {
    id: user.id,
  };
};

const generate_access_token = async (user) => {
  return jwt.sign(
    {
      id: user.id,
    },
    ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m",
    },
  );
};

const generate_refresh_token = async (user) => {
  return jwt.sign(
    {
      id: user.id,
    },
    REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    },
  );
};

const generate_otp = (length = 6) => {
  let otp = "";

  for (let i = 0; i < length; i++) {
    otp += crypto.randomInt(0, 10);
  }

  return otp;
};

const get_cursor_pagination = (query) => {
  const limit = Number(query.limit) || 20;
  const cursor = query.cursor;

  return {
    take: limit,
    cursor: cursor
      ? {
          cursor: {
            id: cursor,
          },
          skip: 1,
        }
      : {},
  };
};

module.exports = {
  hash_password,
  compare_password,
  create_user_session,
  generate_access_token,
  generate_refresh_token,
  generate_otp,
  get_cursor_pagination,
};
