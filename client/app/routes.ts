import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("signup", "components/auth/signup.tsx"),
  route("login", "components/auth/login.tsx"),
  route("about-us", "components/about.tsx"),
  route("contact-us", "components/contactus.tsx"),
  route("services", "components/services.tsx"),
  route("forgot-password", "components/auth/forgetPassword.tsx"),
  route("reset-password", "components/auth/resetPassword.tsx"),
  route("dashboard", "components/dashboard/dashboardHome.tsx"),
] satisfies RouteConfig;
