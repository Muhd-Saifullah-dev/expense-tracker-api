const { redis, responses } = require("@/shared");

const redis_rate_limit = (limit, window) => {
  return async (req, res, next) => {
    try {
      const user = req.user?.id || req.ip;
      const rateKey = `rate:${user}`;
      const banKey = `ban:${user}`;

      const ttl = await redis.ttl(banKey);
      if (ttl > 0) {
        return res
          .status(429)
          .json(
            responses.generic_error(
              429,
              `Too many requests. Try again after ${ttl} seconds.`,
            ),
          );
      }

      const count = await redis.incr(rateKey);
      if (count === 1) {
        await redis.expire(rateKey, window);
      }
      if (count > limit) {
        await redis.set(banKey, "1","EX", 60 );
        await redis.del(rateKey);

        return res
          .status(429)
          .json(
            responses.generic_error(
              429,
              "Too many requests. You are banned for 60 seconds.",
            ),
          );
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = redis_rate_limit;
