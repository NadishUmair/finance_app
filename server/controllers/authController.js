const { prisma } = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


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
    console.log("emailexist",emailExist)

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
        createdAt: new Date()
      }
    })
    
    await tx.membership.create({
      data: {
        userId: user.id,
        organizationId: organization.id,
        role: "ADMIN"
      }
    })
   
    return (user,organization);
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
          organization: true 
        }
      }}
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
      { userId: user.id,
        organizationId: membership.organizationId,
        role: membership.role
       },
      process.env.JWTSECRET,
      { expiresIn: "7d" }
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


//Update password
