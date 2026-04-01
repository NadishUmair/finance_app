const { prisma } = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../util/nodeMailer");

// SignUp controller
exports.SignUp = async (req, res) => {
  try {
    console.log("SignUp called", req.body);
    const { firstname, lastname, orgName, email, password } = req.body;

    if (!firstname || !email || !orgName || !password) {
      return res.status(400).json({
        success: false,
        message: "firstname, email, and password are required",
      });
    }

    const emailExist = await prisma.user.findUnique({
      where: { email },
    });
    console.log("emailexist", emailExist);

    if (emailExist) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          firstname,
          lastname,
          email,
          password: hashPassword,
        },
      });

      const organization = await tx.organization.create({
        data: {
          name: orgName,
          currency: "USD",
          createdAt: new Date(),
        },
      });

      await tx.membership.create({
        data: {
          userId: user.id,
          organizationId: organization.id,
          role: "ADMIN",
        },
      });

      return (user, organization);
    });

    // console.log("User created", { id: user.id, email: user.email });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: result,
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

// Login controller
exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        memberships: {
          include: {
            organization: true,
          },
        },
      },
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

    const membership = user.memberships[0];

    const token = jwt.sign(
      {
        userId: user.id,
        organizationId: membership.organizationId,
        role: membership.role,
      },
      process.env.JWTSECRET,
      { expiresIn: "7d" },
    );

    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      success: true,
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        role: membership.role,
        orgId: membership.organizationId,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//Forget password

exports.forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email not found",
      });
    }

    const otp = Math.floor(1000 + Math.random() * 9000);
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    await prisma.user.update({
      where: { email },
      data: {
        otp,
        otpExpiry,
      },
    });

    await sendEmail(
      email,
      "Password Reset OTP",
      `Your OTP for password reset is ${otp}. It is valid for 5 minutes.`,
    );

    return res.status(200).json({
      success: true,
      message: "OTP sent to email",
    });
  } catch (error) {}
};

//Verify Otp

exports.verifyOtp = async (req, res) => {
  try {
    console.log("verifyOtp called", req.body);
    const { email, otp } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email not found",
      });
    }

    if (user.otp !== parseInt(otp) || user.otpExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }
    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


//Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email not found",
      });
    }
    const hashPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { email }, 
      data: {
        password: hashPassword,
        otp: null,    
        otpExpiry: null,
      },
    }); 
    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false, 
      message: "Internal server error",
    });
  }
};

