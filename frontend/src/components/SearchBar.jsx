function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      name="search"
      value={value}
      onChange={onChange}
      placeholder="Search items..."
      className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
      aria-label="Search items"
    />
  );
}

export default SearchBar;
