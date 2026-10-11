import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { formatApiErrorMessage } from "../utils/validation";

function Dashboard() {
  const { user } = useAuth();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchMyItems();
  }, [user?.id]);

  const fetchMyItems = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      const response = await api.get("/items");

      const myItems = response.data.filter(
        (item) => item.reportedBy?._id === user?.id
      );

      setItems(myItems);
    } catch (error) {
      setErrorMessage(
        formatApiErrorMessage(
          error,
          "Failed to load your reports. Please try refreshing the page."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const active = items.filter((item) => item.status === "active").length;
  const claimed = items.filter((item) => item.status === "claimed").length;
  const recovered = items.filter((item) => item.status === "recovered").length;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-2 text-3xl font-bold">
        Welcome, {user?.name || "Student"}
      </h1>

      <p className="mb-8 text-gray-500">
        Manage your lost and found reports.
      </p>

      {errorMessage && (
        <div
          role="alert"
          className="mb-6 rounded-lg bg-red-100 p-4 text-sm font-medium text-red-700 border border-red-200 flex items-center justify-between"
        >
          <span>{errorMessage}</span>
          <button
            onClick={fetchMyItems}
            className="ml-4 underline font-semibold hover:text-red-900"
          >
            Retry
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="mb-10 grid gap-5 md:grid-cols-4">
        <div className="rounded-xl border bg-white p-6">
          <p className="text-gray-500">Total Reports</p>
          <p className="mt-2 text-3xl font-bold">{items.length}</p>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <p className="text-gray-500">Active</p>
          <p className="mt-2 text-3xl font-bold">{active}</p>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <p className="text-gray-500">Claimed</p>
          <p className="mt-2 text-3xl font-bold">{claimed}</p>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <p className="text-gray-500">Recovered</p>
          <p className="mt-2 text-3xl font-bold">{recovered}</p>
        </div>
      </div>

      {/* Reports */}
      <h2 className="mb-5 text-2xl font-bold">My Reports</h2>

      {loading ? (
        <p className="text-gray-500">Loading your reports...</p>
      ) : items.length === 0 ? (
        <div className="rounded-lg bg-gray-100 p-10 text-center">
          <p className="mb-4 text-gray-600">
            You haven't reported any items yet.
          </p>
          <Link
            to="/report"
            className="inline-block rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Report Item
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left font-semibold text-gray-700">Item</th>
                <th className="p-4 text-left font-semibold text-gray-700">Type</th>
                <th className="p-4 text-left font-semibold text-gray-700">Status</th>
                <th className="p-4 text-left font-semibold text-gray-700">Action</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr key={item._id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-medium">{item.title}</td>
                  <td className="p-4 capitalize">{item.type}</td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                        item.status === "active"
                          ? "bg-blue-100 text-blue-700"
                          : item.status === "claimed"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <Link
                      to={`/items/${item._id}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Dashboard;