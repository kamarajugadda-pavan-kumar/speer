// controllers/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../modals/userModel");

const signUpUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the user with the provided email already exists
    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create a new user
    const newUser = await userModel.createUser({
      username,
      email,
      passwordHash,
    });

    return res.status(201).json({ user: newUser });
  } catch (error) {
    console.error("Error signing up user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Retrieve user by email
    const user = await userModel.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if the provided password matches the stored hash
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate and send an access token
    const accessToken = jwt.sign(
      { userId: user.user_id, email: user.email },
      process.env.jwtSecret,
      { expiresIn: "2h" }
    );
    res.json({ accessToken });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  signUpUser,
  loginUser,
};
