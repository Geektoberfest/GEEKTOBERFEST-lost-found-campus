import { useEffect, useState } from "react";
import api from "../services/api";
import ItemCard from "../components/ItemCard";
import SearchBar from "../components/SearchBar";


function Items() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

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
      console.error(error);
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

      {/* Search */}
      <div className="mb-6">
        <SearchBar value={filters.search}onChange={handleChange}/>
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleChange}
          placeholder="Search items..."
          className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Filters */}
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        
        <select
          name="category"
          value={filters.category}
          onChange={handleChange}
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
          className="rounded-lg border px-4 py-3"
        >
          <option value="">All Locations</option>
          <option value="Library">Library</option>
          <option value="Canteen">Canteen</option>
          <option value="Hostel">Hostel</option>
          <option value="Main Gate">Main Gate</option>
          <option value="Academic Block">
            Academic Block
          </option>
          <option value="Sports Complex">
            Sports Complex
          </option>
          <option value="Parking">Parking</option>
          <option value="Other">Other</option>
        </select>

        <select
          name="type"
          value={filters.type}
          onChange={handleChange}
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
        className="mb-8 rounded-lg border px-4 py-2 hover:bg-gray-100"
      >
        Clear Filters
      </button>

      {/* Results */}
      {loading ? (
        <p>Loading items...</p>
      ) : items.length === 0 ? (
        <div className="rounded-lg bg-gray-100 p-10 text-center">
          <p className="text-gray-500">
            No items found.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ItemCard
              key={item._id}
              item={item}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Items;