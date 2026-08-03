const jwt = require("jsonwebtoken");
const { responses, prisma } = require("@/shared");
const { ACCESS_TOKEN_SECRET } = require("@/config/env.config");

const authenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json(responses.unauthorized_error("Authentication required"));
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return res
        .status(401)
        .json(responses.unauthorized_error("User not found"));
    }
  req.user = {
  id: user.id,
};
    next();
  } catch (error) {
    return res
      .status(401)
      .json(responses.unauthorized_error("Invalid or expired token"));
  }
};

module.exports = authenticated;
