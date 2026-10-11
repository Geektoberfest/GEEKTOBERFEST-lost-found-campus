import { useEffect, useState } from "react";
import api from "../services/api";
import ItemCard from "../components/ItemCard";
import { formatApiErrorMessage } from "../utils/validation";

function Items() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    location: "",
    type: "",
    status: "",
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async (customFilters = filters) => {
    try {
      setLoading(true);
      setErrorMessage("");

      const params = {};

      Object.keys(customFilters).forEach((key) => {
        if (customFilters[key]) {
          params[key] = customFilters[key];
        }
      });

      const response = await api.get("/items", {
        params,
      });

      setItems(response.data);
    } catch (error) {
      setErrorMessage(
        formatApiErrorMessage(
          error,
          "Failed to load items. Please verify your connection and try again."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedFilters = {
      ...filters,
      [name]: value,
    };

    setFilters(updatedFilters);
    fetchItems(updatedFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      search: "",
      category: "",
      location: "",
      type: "",
      status: "",
    };

    setFilters(emptyFilters);
    fetchItems(emptyFilters);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-8 text-3xl font-bold">
        Lost & Found Items
      </h1>

      {errorMessage && (
        <div
          role="alert"
          className="mb-6 rounded-lg bg-red-100 p-4 text-sm font-medium text-red-700 border border-red-200 flex items-center justify-between"
        >
          <span>{errorMessage}</span>
          <button
            onClick={() => fetchItems()}
            className="ml-4 underline font-semibold hover:text-red-900"
          >
            Retry
          </button>
        </div>
      )}

      {/* Search */}
      <div className="mb-6">
        <label htmlFor="search-items" className="sr-only">
          Search items
        </label>
        <input
          id="search-items"
          type="text"
          name="search"
          value={filters.search}
          onChange={handleChange}
          placeholder="Search items by title or description..."
          aria-label="Search items by title or description"
          className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Filters */}
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <select
          name="category"
          value={filters.category}
          onChange={handleChange}
          aria-label="Filter by category"
          className="rounded-lg border px-4 py-3"
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Documents">Documents</option>
          <option value="Clothing">Clothing</option>
          <option value="Accessories">Accessories</option>
          <option value="Books">Books</option>
          <option value="Keys">Keys</option>
          <option value="Bags">Bags</option>
          <option value="Other">Other</option>
        </select>

        <select
          name="location"
          value={filters.location}
          onChange={handleChange}
          aria-label="Filter by location"
          className="rounded-lg border px-4 py-3"
        >
          <option value="">All Locations</option>
          <option value="Library">Library</option>
          <option value="Canteen">Canteen</option>
          <option value="Hostel">Hostel</option>
          <option value="Main Gate">Main Gate</option>
          <option value="Academic Block">Academic Block</option>
          <option value="Sports Complex">Sports Complex</option>
          <option value="Parking">Parking</option>
          <option value="Other">Other</option>
        </select>

        <select
          name="type"
          value={filters.type}
          onChange={handleChange}
          aria-label="Filter by type"
          className="rounded-lg border px-4 py-3"
        >
          <option value="">Lost & Found</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>

        <select
          name="status"
          value={filters.status}
          onChange={handleChange}
          aria-label="Filter by status"
          className="rounded-lg border px-4 py-3"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="claimed">Claimed</option>
          <option value="recovered">Recovered</option>
        </select>
      </div>

      <button
        onClick={clearFilters}
        className="mb-8 rounded-lg border px-4 py-2 hover:bg-gray-100 transition-colors"
      >
        Clear Filters
      </button>

      {/* Results */}
      {loading ? (
        <p className="text-gray-500">Loading items...</p>
      ) : items.length === 0 ? (
        <div className="rounded-lg bg-gray-100 p-10 text-center">
          <p className="text-gray-500">
            No items found matching the selected criteria.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Items;