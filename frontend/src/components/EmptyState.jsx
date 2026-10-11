import { Link } from "react-router-dom";

function EmptyState({
  filters = {},
  onResetFilters,
  onClearFilter,
  className = "",
}) {
  const trimmedSearch = (filters.search || "").trim();
  const hasSearch = trimmedSearch.length > 0;

  const activeFilters = [];
  if (filters.category) {
    activeFilters.push({ key: "category", label: "Category", value: filters.category });
  }
  if (filters.location) {
    activeFilters.push({ key: "location", label: "Location", value: filters.location });
  }
  if (filters.type) {
    activeFilters.push({
      key: "type",
      label: "Type",
      value: filters.type.charAt(0).toUpperCase() + filters.type.slice(1),
    });
  }
  if (filters.status) {
    activeFilters.push({
      key: "status",
      label: "Status",
      value: filters.status.charAt(0).toUpperCase() + filters.status.slice(1),
    });
  }
  if (filters.sortBy) {
    activeFilters.push({
      key: "sortBy",
      label: "Sort",
      value: filters.sortBy,
    });
  }

  const hasFilterOptions = activeFilters.length > 0;
  const hasActiveCriteria = hasSearch || hasFilterOptions;

  // Determine contextual messaging based on search vs filtered state
  let title = "";
  let description = "";

  if (hasSearch && hasFilterOptions) {
    title = "No items found matching your search and filters";
    description = `No items match "${trimmedSearch}" with the selected filter criteria. Try adjusting your search term or resetting your filters.`;
  } else if (hasSearch) {
    title = `No results found for "${trimmedSearch}"`;
    description = "We couldn't find any lost or found items matching your search term. Check for spelling errors, try broader keywords, or reset your search.";
  } else if (hasFilterOptions) {
    title = "No items match the selected filters";
    description = "There are currently no items matching your filter criteria. Try selecting different options or reset your filters to view all listings.";
  } else {
    title = "No items listed yet";
    description = "There are currently no lost or found items reported on campus. Check back later or report a new item.";
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={`rounded-xl border border-gray-200 bg-white p-8 sm:p-12 text-center shadow-sm ${className}`}
    >
      {/* Icon */}
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
        {hasSearch && !hasFilterOptions ? (
          // Search Icon
          <svg
            className="h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-4.35-4.35m1.85-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        ) : hasFilterOptions && !hasSearch ? (
          // Filter Icon
          <svg
            className="h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
        ) : hasSearch && hasFilterOptions ? (
          // Combined Search & Filter Icon
          <svg
            className="h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16zM8 11h6M11 8v6"
            />
          </svg>
        ) : (
          // Empty Box Icon
          <svg
            className="h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-4a2 2 0 00-2 2v0a2 2 0 01-2 2H10a2 2 0 01-2-2v0a2 2 0 00-2-2H4"
            />
          </svg>
        )}
      </div>

      {/* Heading */}
      <h3 className="mb-2 text-xl font-bold text-gray-900">
        {title}
      </h3>

      {/* Description */}
      <p className="mx-auto mb-6 max-w-lg text-sm text-gray-600 sm:text-base">
        {description}
      </p>

      {/* Active Filter Chips */}
      {hasActiveCriteria && (
        <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Active criteria:
          </span>
          {hasSearch && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 border border-blue-200">
              <span>Search: "{trimmedSearch}"</span>
              {onClearFilter && (
                <button
                  type="button"
                  onClick={() => onClearFilter("search")}
                  className="rounded-full hover:bg-blue-100 p-0.5 text-blue-500 hover:text-blue-800 transition-colors cursor-pointer"
                  aria-label="Clear search query"
                  title="Clear search"
                >
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </span>
          )}
          {activeFilters.map((filter) => (
            <span
              key={filter.key}
              className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 border border-gray-200"
            >
              <span>{filter.label}: {filter.value}</span>
              {onClearFilter && (
                <button
                  type="button"
                  onClick={() => onClearFilter(filter.key)}
                  className="rounded-full hover:bg-gray-200 p-0.5 text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                  aria-label={`Clear ${filter.label} filter`}
                  title={`Clear ${filter.label}`}
                >
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {hasActiveCriteria && onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors cursor-pointer"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Reset Filters
          </button>
        )}

        <Link
          to="/report"
          className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors ${
            hasActiveCriteria
              ? "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              : "bg-blue-600 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          }`}
        >
          Report an Item
        </Link>
      </div>
    </div>
  );
}

export default EmptyState;
