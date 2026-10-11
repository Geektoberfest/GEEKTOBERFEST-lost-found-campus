import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isValidEmail, formatApiErrorMessage } from "../utils/validation";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateField = (name, value, currentForm = form) => {
    switch (name) {
      case "name": {
        const trimmed = value.trim();
        if (!trimmed) {
          return "Please enter your full name.";
        }
        if (trimmed.length < 2) {
          return "Full name must be at least 2 characters long.";
        }
        return "";
      }
      case "email": {
        const trimmed = value.trim();
        if (!trimmed) {
          return "Please enter your email address.";
        }
        if (!isValidEmail(trimmed)) {
          return "Please enter a valid email address (e.g., student@campus.edu).";
        }
        return "";
      }
      case "password": {
        if (!value) {
          return "Please enter a password.";
        }
        if (value.length < 6) {
          return "Password must be at least 6 characters long.";
        }
        return "";
      }
      case "confirmPassword": {
        if (!value) {
          return "Please confirm your password.";
        }
        if (value !== currentForm.password) {
          return "Your passwords don't match. Please try again.";
        }
        return "";
      }
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };
    setForm(updatedForm);

    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value, updatedForm),
      }));
    }

    // Re-check confirmPassword if password is changed and confirmPassword was touched
    if (name === "password" && touched.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validateField("confirmPassword", updatedForm.confirmPassword, updatedForm),
      }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({
      ...prev,
      [field]: validateField(field, form[field], form),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    const newErrors = {
      name: validateField("name", form.name, form),
      email: validateField("email", form.email, form),
      password: validateField("password", form.password, form),
      confirmPassword: validateField("confirmPassword", form.confirmPassword, form),
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((msg) => Boolean(msg));
    if (hasErrors) {
      return;
    }

    setError("");
    setLoading(true);

    try {
      await register(form.name.trim(), form.email.trim(), form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(
        formatApiErrorMessage(
          err,
          "Registration failed. Please verify your details and try again."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6 py-8">
      <div className="w-full max-w-md">
        <h1 className="mb-8 text-center text-3xl font-bold">Create Account</h1>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-lg bg-red-100 p-4 text-sm font-medium text-red-700 border border-red-200"
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-5 rounded-xl border bg-white p-8 shadow-sm"
        >
          <div>
            <label htmlFor="name" className="mb-2 block font-medium">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              onBlur={() => handleBlur("name")}
              placeholder="e.g. John Doe"
              autoComplete="name"
              aria-invalid={Boolean(touched.name && errors.name)}
              aria-describedby={touched.name && errors.name ? "name-error" : undefined}
              className={`w-full rounded-lg border p-3 outline-none transition-colors ${
                touched.name && errors.name
                  ? "border-red-500 focus:ring-2 focus:ring-red-300"
                  : "border-gray-300 focus:ring-2 focus:ring-blue-500"
              }`}
            />
            {touched.name && errors.name && (
              <p
                id="name-error"
                role="alert"
                className="mt-1.5 text-sm font-medium text-red-600"
              >
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block font-medium">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              onBlur={() => handleBlur("email")}
              placeholder="e.g. student@campus.edu"
              autoComplete="email"
              aria-invalid={Boolean(touched.email && errors.email)}
              aria-describedby={touched.email && errors.email ? "email-error" : undefined}
              className={`w-full rounded-lg border p-3 outline-none transition-colors ${
                touched.email && errors.email
                  ? "border-red-500 focus:ring-2 focus:ring-red-300"
                  : "border-gray-300 focus:ring-2 focus:ring-blue-500"
              }`}
            />
            {touched.email && errors.email && (
              <p
                id="email-error"
                role="alert"
                className="mt-1.5 text-sm font-medium text-red-600"
              >
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              onBlur={() => handleBlur("password")}
              placeholder="At least 6 characters"
              autoComplete="new-password"
              aria-invalid={Boolean(touched.password && errors.password)}
              aria-describedby={touched.password && errors.password ? "password-error" : undefined}
              className={`w-full rounded-lg border p-3 outline-none transition-colors ${
                touched.password && errors.password
                  ? "border-red-500 focus:ring-2 focus:ring-red-300"
                  : "border-gray-300 focus:ring-2 focus:ring-blue-500"
              }`}
            />
            {touched.password && errors.password && (
              <p
                id="password-error"
                role="alert"
                className="mt-1.5 text-sm font-medium text-red-600"
              >
                {errors.password}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-2 block font-medium">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              onBlur={() => handleBlur("confirmPassword")}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              aria-invalid={Boolean(touched.confirmPassword && errors.confirmPassword)}
              aria-describedby={touched.confirmPassword && errors.confirmPassword ? "confirmPassword-error" : undefined}
              className={`w-full rounded-lg border p-3 outline-none transition-colors ${
                touched.confirmPassword && errors.confirmPassword
                  ? "border-red-500 focus:ring-2 focus:ring-red-300"
                  : "border-gray-300 focus:ring-2 focus:ring-blue-500"
              }`}
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <p
                id="confirmPassword-error"
                role="alert"
                className="mt-1.5 text-sm font-medium text-red-600"
              >
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="mt-5 text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;