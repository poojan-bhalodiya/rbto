// src/middleware/authorization.js
const authorizationMiddleware = (req, res, next) => {
  const expectedStoreValue = "rbto";
  const providedStoreValue = req.headers["store"];

  // Check if 'store' header is present and has the correct value
  if (!providedStoreValue || providedStoreValue !== expectedStoreValue) {
    return res
      .status(401)
      .json({ error: "Unauthorized" });
  }

  // Authorization successful, continue with the next middleware or route handler
  next();
};

module.exports = authorizationMiddleware;
