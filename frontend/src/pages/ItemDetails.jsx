import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { formatApiErrorMessage } from "../utils/validation";

function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  // Claim form states
  const [claimMessage, setClaimMessage] = useState("");
  const [showClaim, setShowClaim] = useState(false);
  const [claimTouched, setClaimTouched] = useState(false);
  const [claimError, setClaimError] = useState("");
  const [claimServerError, setClaimServerError] = useState("");
  const [claimSubmitting, setClaimSubmitting] = useState(false);

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      const response = await api.get(`/items/${id}`);
      setItem(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const isOwner =
    user && item && item.reportedBy?._id === user.id;

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this report?"
    );
    if (!confirmed) return;

    try {
      await api.delete(`/items/${id}`);
      alert("Report deleted");
      navigate("/items");
    } catch (error) {
      alert(
        formatApiErrorMessage(
          error,
          "Failed to delete the report. Please try again."
        )
      );
    }
  };

  const handleRecovered = async () => {
    try {
      await api.patch(`/items/${id}/status`, {
        status: "recovered",
      });
      fetchItem();
    } catch (error) {
      alert(
        formatApiErrorMessage(
          error,
          "Failed to update status. Please try again."
        )
      );
    }
  };

  const validateClaim = (value) => {
    const trimmed = (value || "").trim();
    if (!trimmed) {
      return "Please provide details explaining why this item belongs to you.";
    }
    if (trimmed.length < 10) {
      return "Please enter at least 10 characters with specific identifiable details (e.g., color, markings, contents).";
    }
    if (trimmed.length > 500) {
      return "Claim details cannot exceed 500 characters.";
    }
    return "";
  };

  const handleClaimChange = (e) => {
    const value = e.target.value;
    setClaimMessage(value);
    if (claimTouched) {
      setClaimError(validateClaim(value));
    }
  };

  const handleClaimBlur = () => {
    setClaimTouched(true);
    setClaimError(validateClaim(claimMessage));
  };

  const handleClaim = async (e) => {
    e.preventDefault();

    setClaimTouched(true);
    const err = validateClaim(claimMessage);
    setClaimError(err);
    if (err) {
      return;
    }

    try {
      setClaimSubmitting(true);
      setClaimServerError("");

      await api.post(`/items/${id}/claims`, {
        message: claimMessage.trim(),
      });

      alert("Claim submitted successfully!");
      setClaimMessage("");
      setClaimTouched(false);
      setClaimError("");
      setShowClaim(false);
    } catch (error) {
      setClaimServerError(
        formatApiErrorMessage(
          error,
          "Failed to submit claim. Please try again."
        )
      );
    } finally {
      setClaimSubmitting(false);
    }
  };

  const handleCancelClaim = () => {
    setShowClaim(false);
    setClaimMessage("");
    setClaimTouched(false);
    setClaimError("");
    setClaimServerError("");
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading...
      </div>
    );
  }

  if (!item) {
    return (
      <div className="p-10 text-center text-gray-500">
        Item not found.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="h-80 w-full object-cover"
          />
        ) : (
          <div className="flex h-80 items-center justify-center bg-gray-100 text-gray-400">
            No Image
          </div>
        )}

        <div className="p-8">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-3xl font-bold">{item.title}</h1>

            <span
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                item.type === "lost"
                  ? "bg-red-100 text-red-600"
                  : "bg-green-100 text-green-600"
              }`}
            >
              {item.type.toUpperCase()}
            </span>
          </div>

          <p className="mb-6 text-gray-600">{item.description}</p>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <strong>Category:</strong> {item.category}
            </div>

            <div>
              <strong>Location:</strong> {item.location}
            </div>

            <div>
              <strong>Date:</strong>{" "}
              {new Date(item.date).toLocaleDateString()}
            </div>

            <div>
              <strong>Status:</strong> {item.status}
            </div>

            <div>
              <strong>Reported By:</strong> {item.reportedBy?.name}
            </div>
          </div>

          {/* Owner buttons */}
          {isOwner && (
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={`/items/${item._id}/edit`}
                className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 transition-colors"
              >
                Edit
              </Link>

              <button
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700 transition-colors"
              >
                Delete
              </button>

              {item.status !== "recovered" && (
                <button
                  onClick={handleRecovered}
                  className="rounded-lg bg-green-600 px-5 py-2 text-white hover:bg-green-700 transition-colors"
                >
                  Mark Recovered
                </button>
              )}

              <Link
                to={`/items/${item._id}/claims`}
                className="rounded-lg border px-5 py-2 hover:bg-gray-100 transition-colors"
              >
                View Claims
              </Link>
            </div>
          )}

          {/* Claim */}
          {!isOwner && user && item.status === "active" && (
            <div className="mt-8">
              {!showClaim ? (
                <button
                  onClick={() => setShowClaim(true)}
                  className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  Claim This Item
                </button>
              ) : (
                <form
                  onSubmit={handleClaim}
                  noValidate
                  className="rounded-xl border bg-gray-50 p-6"
                >
                  <h2 className="mb-2 text-xl font-semibold">
                    Why is this your item?
                  </h2>
                  <p className="mb-4 text-sm text-gray-600">
                    Provide verifiable details that prove ownership, such as distinctive marks, engravings, or contents.
                  </p>

                  {claimServerError && (
                    <div
                      role="alert"
                      className="mb-4 rounded-lg bg-red-100 p-3 text-sm font-medium text-red-700 border border-red-200"
                    >
                      {claimServerError}
                    </div>
                  )}

                  <label htmlFor="claim-details" className="sr-only">
                    Claim Details
                  </label>
                  <textarea
                    id="claim-details"
                    name="claimDetails"
                    value={claimMessage}
                    onChange={handleClaimChange}
                    onBlur={handleClaimBlur}
                    rows="5"
                    maxLength={500}
                    placeholder="Provide details to verify your claim (minimum 10 characters)..."
                    aria-invalid={Boolean(claimTouched && claimError)}
                    aria-describedby={claimTouched && claimError ? "claim-error" : undefined}
                    className={`mb-2 w-full rounded-lg border p-3 outline-none transition-colors ${
                      claimTouched && claimError
                        ? "border-red-500 bg-white focus:ring-2 focus:ring-red-300"
                        : "border-gray-300 bg-white focus:ring-2 focus:ring-blue-500"
                    }`}
                  />
                  {claimTouched && claimError && (
                    <p
                      id="claim-error"
                      role="alert"
                      className="mb-3 text-sm font-medium text-red-600"
                    >
                      {claimError}
                    </p>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={claimSubmitting}
                      className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      {claimSubmitting ? "Submitting Claim..." : "Submit Claim"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelClaim}
                      disabled={claimSubmitting}
                      className="rounded-lg border border-gray-300 bg-white px-5 py-2 font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ItemDetails;