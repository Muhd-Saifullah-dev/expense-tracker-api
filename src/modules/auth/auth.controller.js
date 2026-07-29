const {
  prisma,
  hash_password,
  compare_password,
  create_user_session,
  responses,
} = require("@shared/index");

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

    await redis.set(`refresh:${user.id}`, refreshToken, "EX", 60 * 60 * 24 * 7);

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
    const { email, name, password, postalCode, region, city } = req.body;

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
        postalCode,
        region,
        city,
      },
    });

    const accessToken = await generate_access_token(user);
    const refreshToken = await generate_refresh_token(user);

    await redis.set(`refresh:${user.id}`, refreshToken, "EX", 60 * 60 * 24 * 7);

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

    await redis.del(`refresh:${userId}`);

    return res
      .status(200)
      .json(responses.ok_response(null, "logout successfully"));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  register_user,
  logout,
};
