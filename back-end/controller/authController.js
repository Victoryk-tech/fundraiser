const {
  signUpValidation,
  signInValidation,
} = require("../middleware/joiValidation");
const userAuth = require("../model/authModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  try {
    const { email, phoneNumber, password, retypePassword } = req.body;
    const validationData = { email, phoneNumber, password };
    const { error } = signUpValidation(validationData);
    if (error) {
      return res
        .status(400)
        .json({ message: error.details[0].message, success: false });
    }

    const checkEmail = await userAuth.findOne({ email: email });
    if (checkEmail) {
      return res
        .status(400)
        .json({ message: "Email already exists", success: false });
    }

    if (password !== retypePassword) {
      return res
        .status(400)
        .json({ message: "Password mismatch", success: false });
    }

    await userAuth.create({
      email,
      phoneNumber,
      password,
    });

    return res
      .status(201)
      .json({ message: "Account created successfully", success: true });
  } catch (error) {
    return res.status(500).json({
      message: "Error occurred !!",
      success: false,
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { error } = signInValidation(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: error.details[0].message, success: false });
    }

    const { email, password } = req.body;
    const user = await userAuth.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Wrong Email", success: false });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: "Incorrect password", success: false });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const { password: pass, ...rest } = user._doc;

    res.cookie("FundLand", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      message: "Logged in successfully",
      success: true,
      token,
      user: rest,
    });
  } catch (error) {
    console.error("Error occurred during login:", error);
    return res.status(500).json({
      message: "Error occurred during login",
      success: false,
      error: error.message,
    });
  }
};

module.exports = { createUser, loginUser };
