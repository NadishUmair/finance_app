const otp = Math.floor(100000 + Math.random() * 900000);

await prisma.user.update({
  where: { email },
  data: {
    otp: otp,
    otpExpiry: new Date(Date.now() + 5 * 60 * 1000), // 5 min
  },
});