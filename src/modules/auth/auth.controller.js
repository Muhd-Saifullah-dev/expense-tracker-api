const { prisma, hash_password, compare_password } = require("@shared/index");

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordMatch = await compare_password(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // create redis session
    req.session.user = {
      id: user.id,
      email: user.email,
    };

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
      },
    });
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
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
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

    req.session.user = {
      id: user.id,
      email: user.email,
    };

    return res.status(201).json({
      success: true,
      message: "User registered",
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }

      res.clearCookie("connect.sid");

      return res.status(200).json({
        success: true,
        message: "Logout successful",
      });
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  register_user,
  logout,
};
