import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isValidEmail, formatApiErrorMessage } from "../utils/validation";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateField = (field, value) => {
    if (field === "email") {
      if (!value.trim()) {
        return "Please enter your email address.";
      }
      if (!isValidEmail(value)) {
        return "Please enter a valid email address (e.g., student@campus.edu).";
      }
      return "";
    }

    if (field === "password") {
      if (!value) {
        return "Please enter your password.";
      }
      return "";
    }

    return "";
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const value = field === "email" ? email : password;
    setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (touched.email) {
      setErrors((prev) => ({ ...prev, email: validateField("email", value) }));
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (touched.password) {
      setErrors((prev) => ({ ...prev, password: validateField("password", value) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({ email: true, password: true });
    const emailErr = validateField("email", email);
    const passErr = validateField("password", password);
    setErrors({ email: emailErr, password: passErr });

    if (emailErr || passErr) {
      return;
    }

    setError("");
    setLoading(true);

    try {
      await login(email.trim(), password);
      navigate("/dashboard");
    } catch (err) {
      setError(
        formatApiErrorMessage(
          err,
          "Login failed. Please verify your credentials and try again."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6">
      <div className="w-full max-w-md">
        <h1 className="mb-8 text-center text-3xl font-bold">Login</h1>

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
            <label htmlFor="email" className="mb-2 block font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              onBlur={() => handleBlur("email")}
              placeholder="e.g. user@campus.edu"
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
              name="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              onBlur={() => handleBlur("password")}
              placeholder="Enter your password"
              autoComplete="current-password"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-5 text-center text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;