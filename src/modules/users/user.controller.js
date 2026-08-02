const {
  redis,
  prisma,
  responses,
  redis_keys,
  compare_password,
  hash_password,
} = require("@/shared");

const get_profile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const cachedUser = await redis.get(redis_keys.user(userId));

    if (cachedUser) {
      const user = JSON.parse(cachedUser);
      return res.json(
        responses.ok_response({ user }, "user fetched successfully"),
      );
    }

    // Database
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      return res.status(404).json(responses.not_found_error("user not found"));
    }
    const USER_CACHE_TTL = 60 * 60;
    await redis.set(
      redis_keys.user(user.id),
      JSON.stringify(user),
      "EX",
      USER_CACHE_TTL,
    );

    return res.json(
      responses.ok_response({ user }, "user fetched successfully"),
    );
  } catch (error) {
    next(error);
  }
};

const update_user_profile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { name } = req.body;

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    // Invalidate cache
    await redis.del(redis_keys.user(userId));

    return res
      .status(200)
      .json(
        responses.ok_response(
          { user: updatedUser },
          "user profile update sucessfully",
        ),
      );
  } catch (error) {
    next(error);
  }
};

const update_user_password = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { password, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user) {
      return res.status(404).json(responses.not_found_error("user not found"));
    }

    const isMatch = await compare_password(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    const hashedPassword = await hash_password(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });

    await redis.del(redis_keys.refresh_token(userId));

    return res
      .status(200)
      .json(
        responses.update_success_response(null, "password changed sucesfully"),
      );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  update_user_password,
  update_user_profile,
  get_profile,
};
