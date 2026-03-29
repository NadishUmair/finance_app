const { prisma } = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.SignUp = async (req, res) => {
  try {
    console.log("SignUp called", req.body);
    const { firstname, lastname, email, password } = req.body;

    if (!firstname || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "firstname, email, and password are required",
      });
    }

    const emailExist = await prisma.user.findUnique({
      where: { email },
    });

    if (emailExist) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        firstname,
        lastname,
        email,
        password: hashPassword,
      },
    });

    console.log("User created", { id: user.id, email: user.email });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: { id: user.id, email: user.email },
    });

  } catch (error) {
    console.error("SignUp error", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message || String(error),
    });
  }
};






exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email not exist",
      });
    }

    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    const accessToken = jwt.sign(
      { id: user.id },
      process.env.JWTSECRET,
      { expiresIn: "7d" }
    );

    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      success: true,
      data: userWithoutPassword,
      accessToken,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};