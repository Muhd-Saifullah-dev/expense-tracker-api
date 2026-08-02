const redis_keys = {
  user: (id) => `user:${id}`,
  refresh_token: (userId) => `refresh:${userId}`,

  forgot_password: (email) => `forgot-password:${email}`,

  otp_verified: (email) => `otp-verified:${email}`,
};

module.exports = redis_keys;
