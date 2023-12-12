const JWT = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const authentication = async (req, res, next) => {
  try {
    let check = JWT.verify(req.headers.authorization, process.env.SECRET_KEY);
    if (check) {
      next();
    }
  } catch (error) {
    res.json({
      statusCode: 400,
      message: "Unauthorized please login",
    });
  }
};
const createToken = async ({ email, username, name }) => {
  let token = JWT.sign({ email, username, name }, process.env.SECRET_KEY, {
    expiresIn: "10h",
  });
  return token;
};
module.exports = { authentication, createToken };
