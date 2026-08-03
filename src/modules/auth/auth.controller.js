const { REFRESH_TOKEN_SECRET } = require("@/config/env.config");
const otpQueue = require("@/queues/otp-queue");
const welcomeQueue = require("@/queues/welcome-queu");
const {
  prisma,
  hash_password,
  compare_password,
  create_user_session,
  responses,
  redis,
  generate_otp,
  redis_keys,
  send_mail,
  otpTemplate,
  generate_access_token,
  generate_refresh_token,
} = require("@shared/index");
const jwt=require("jsonwebtoken")
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json(responses.not_found_error("User not found"));
    }

    const isPasswordMatch = await compare_password(password, user.password);

    if (!isPasswordMatch) {
      return res
        .status(401)
        .json(responses.bad_request_error("Invalid Credential"));
    }

    const accessToken = await generate_access_token(user);

    const refreshToken = await generate_refresh_token(user);

    await redis.set(
      redis_keys.refresh_token(user.id),
      refreshToken,
      "EX",
      60 * 60 * 24 * 7,
    );

    return res.status(200).json(
      responses.ok_response(
        {
          accessToken,
          refreshToken,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
        },
        "Login successful",
      ),
    );
  } catch (error) {
    next(error);
  }
};

const register_user = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res
        .status(400)
        .json(responses.bad_request_error("user is already exist"));
    }

    const hashedPassword = await hash_password(password);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    const accessToken = await generate_access_token(user);
    const refreshToken = await generate_refresh_token(user);

    await redis.set(
      redis_keys.refresh_token(user.id),
      refreshToken,
      "EX",
      60 * 60 * 24 * 7,
    );

    await welcomeQueue.add("welcome-email", {
      email: user.email,
      name: user.name,
    });

    return res.status(201).json(
      responses.create_success_response({
        accessToken,
        refreshToken,
        id: user.id,
        email: user.email,
      }),
    );
  } catch (error) {
    next(error);
  }
};
const logout = async (req, res, next) => {
  try {
    const userId = req.user.id;

    await redis.del(redis_keys.refresh_token(userId));

    return res
      .status(200)
      .json(responses.ok_response(null, "logout successfully"));
  } catch (error) {
    next(error);
  }
};

const forget_password = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json(responses.not_found_error("user not found"));
    }

    const otp = generate_otp(6);

    await redis.set(
      redis_keys.forgot_password(email),
      otp,
      "EX",
      300, // 5 minutes
    );

    await otpQueue.add("otp-email",{
      email:user.email,
      name:user.name,
      otp:otp
    })
   

    return res
      .status(200)
      .json(responses.ok_response(otp, "otp send to your email"));
  } catch (error) {
    next(error);
  }
};

const verify_otp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const storedOtp = await redis.get(`forgot-password:${email}`);

    if (!storedOtp) {
      return res
        .status(400)
        .json(responses.bad_request_error("Otp expired", null));
    }

    if (storedOtp !== otp) {
      return res
        .status(400)
        .json(responses.bad_request_error("Invalid Otp", null));
    }

    await redis.set(redis_keys.otp_verified(email), "true", "EX", 600);

    await redis.del(redis_keys.forgot_password(email));

    return res.status(200).json(responses.ok_response("Otp verified"));
  } catch (error) {
    next(error);
  }
};

const reset_password = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;

    const isVerified = await redis.get(redis_keys.otp_verified(email));

    if (!isVerified) {
      return res
        .status(400)
        .json(responses.bad_request_error("your time out try again", null));
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json(responses.not_found_error("user not found"));
    }

    const hashedPassword = await hash_password(newPassword);

    await prisma.user.update({
      where: {
        email,
      },
      data: {
        password: hashedPassword,
      },
    });

    // remove verification after password update
    await redis.del(redis_keys.otp_verified(email));

    return res
      .status(200)
      .json(responses.ok_response(null, "password reset successfully"));
  } catch (error) {
    next(error);
  }
};


const refresh_token = async (req, res, next) => {
  try {

     const { refreshToken } = req.body;
    



    if (!refreshToken) {
      return res
        .status(400)
        .json(responses.bad_request_error("Refresh token is required"));
    }

    const payload = jwt.verify(
      refreshToken,
      REFRESH_TOKEN_SECRET
    );




    const storedToken = await redis.get(
      redis_keys.refresh_token(payload.id)
    );

    if (!storedToken || storedToken !== refreshToken) {
      return res
        .status(401)
        .json(responses.unauthorized_error("Invalid refresh token"));
    }

    const user = await prisma.user.findUnique({
      where: {
        id: payload.id,
      },
    });

    if (!user) {
      return res
        .status(404)
        .json(responses.not_found_error("User not found"));
    }

    const accessToken = await generate_access_token(user);

    return res.status(200).json(
      responses.ok_response(
        {
          accessToken,
        },
        "Access token generated successfully"
      )
    );
  } catch (error) {
    next(error)
  }
}
module.exports = {
  login,
  register_user,
  logout,
  reset_password,
  verify_otp,
  forget_password,
  refresh_token
};
