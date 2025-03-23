// src/locales/login.locale.ts

export const locale = {
  title: "Login to Your Account",
  description: "Enter your credentials to access your account",
  form: {
    email: {
      label: "Email",
      placeholder: "name@example.com",
      required: "Email is required",
      invalid: "Invalid email address",
    },
    password: {
      label: "Password",
      placeholder: "••••••••",
      required: "Password is required",
      minLength: "Password must be at least 6 characters",
    },
    buttons: {
      submit: "Login",
      pending: "Logging in...",
    },
  },
  register: {
    text: "Don't have an account?",
    link: "Sign up",
  },
};
