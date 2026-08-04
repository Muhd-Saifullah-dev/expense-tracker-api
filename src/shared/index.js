const prisma = require("./prisma-client");
const {
  hash_password,
  compare_password,
  create_user_session,
  generate_access_token,
  generate_refresh_token,
  generate_otp,
  get_cursor_pagination,

} = require("./helper");
const Responses = require("./responses");
const redis = require("./redis-client");
const redis_keys = require("./redis-key");
const { send_mail } = require("./mails/send-email-service");
const otpTemplate = require("./mails/templates/otp.template");
const bullmqRedis = require("./bullmq-redis");
const welcomeTemplate = require("./mails/templates/welcome.template");
const responses = new Responses();
module.exports = {
  prisma,
  hash_password,
  compare_password,
  create_user_session,
  responses,
  generate_access_token,
  generate_refresh_token,
  generate_otp,
  redis,
  redis_keys,
  send_mail,
  otpTemplate,
  bullmqRedis,
  welcomeTemplate,
  get_cursor_pagination,

};
