const bcrypt = require("bcrypt");

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
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m",
    }
  );
};


const generate_refresh_token = async (user) => {
  return jwt.sign(
    {
      id: user.id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

module.exports = {
  hash_password,
  compare_password,
  create_user_session,
  generate_access_token,
  generate_refresh_token
};
