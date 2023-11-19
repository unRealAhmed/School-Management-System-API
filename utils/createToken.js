const JWT = require("jsonwebtoken");

// Create a JWT token with user's id and set it as a cookie
const createToken = (res, user) => {
  // Create a JWT token
  const token = JWT.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  // Configure the options for the cookie
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24, // Maximum age of the cookie (one day)
  };

  res.cookie("token", token, cookieOptions);

  return token;
};

module.exports = createToken;
