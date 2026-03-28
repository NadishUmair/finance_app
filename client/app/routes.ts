import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("signup", "components/signup.tsx"),
  route("login", "components/login.tsx"),
  route("about-us", "components/about.tsx"),
  route("contact-us", "components/contactus.tsx"),
  route("services", "components/services.tsx"),
] satisfies RouteConfig;