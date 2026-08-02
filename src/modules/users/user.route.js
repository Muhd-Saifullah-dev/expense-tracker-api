const {
  get_profile,
  update_user_profile,
  update_user_password,
} = require("./user.controller");

const userRouter = require("express").Router();

userRouter.get("/profile", get_profile);
userRouter.patch("/profile", update_user_profile);
userRouter.patch("/change-password", update_user_password);

module.exports = userRouter;
