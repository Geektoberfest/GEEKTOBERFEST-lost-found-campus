import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <p className="text-7xl font-bold text-blue-600">404</p>

      <h1 className="mt-4 text-3xl font-bold text-gray-900">
        Page not found
      </h1>

      <p className="mt-3 max-w-md text-gray-600">
        Sorry, the page you are looking for does not exist.
      </p>

      <Link
        to="/"
        className="mt-6 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
      >
        Go back Home
      </Link>
    </main>
  );
}

export default NotFound;
