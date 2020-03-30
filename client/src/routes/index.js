import Page from "../pages";
export default [
  {
    path: "/",
    page: "Dashboard",
    component: Page.Dashboard,
    exact: true,
    isPrivate: true
  },
  {
    path: "/sign-in",
    page: "Sign In",
    component: Page.SignIn,
    exact: true,
    isPrivate: false
  },
  {
    path: "/sign-up",
    page: "Sign Up",
    component: Page.SignUp,
    isPrivate: false
  }
];
