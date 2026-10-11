import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { formatApiErrorMessage } from "../utils/validation";

function Claims() {
  const { id } = useParams();

  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingClaimId, setUpdatingClaimId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  useEffect(() => {
    fetchClaims();
  }, [id]);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      const response = await api.get(`/items/${id}/claims`);
      setClaims(response.data);
    } catch (error) {
      setErrorMessage(
        formatApiErrorMessage(
          error,
          "Failed to load claims for this item. Please try again."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const updateClaim = async (claimId, status) => {
    try {
      setUpdatingClaimId(claimId);
      setErrorMessage("");
      setFeedbackMessage("");

      await api.patch(`/claims/${claimId}`, { status });

      setFeedbackMessage(
        status === "approved"
          ? "Claim has been approved successfully. Item marked as recovered."
          : "Claim has been rejected."
      );

      await fetchClaims();
    } catch (error) {
      setErrorMessage(
        formatApiErrorMessage(
          error,
          `Failed to ${status} this claim. Please try again.`
        )
      );
    } finally {
      setUpdatingClaimId(null);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-10 text-center text-gray-500">
        Loading claims...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Item Claims</h1>
        <Link
          to={`/items/${id}`}
          className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-100 transition-colors"
        >
          Back to Item
        </Link>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="mb-5 rounded-lg bg-red-100 p-4 text-sm font-medium text-red-700 border border-red-200"
        >
          {errorMessage}
        </div>
      )}

      {feedbackMessage && (
        <div
          role="status"
          className="mb-5 rounded-lg bg-green-100 p-4 text-sm font-medium text-green-700 border border-green-200"
        >
          {feedbackMessage}
        </div>
      )}

      {claims.length === 0 ? (
        <div className="rounded-lg bg-gray-100 p-8 text-center text-gray-600">
          No claims submitted for this item yet.
        </div>
      ) : (
        <div className="space-y-5">
          {claims.map((claim) => (
            <div
              key={claim._id}
              className="rounded-xl border bg-white p-6 shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">
                    {claim.claimant?.name || "Anonymous User"}
                  </h2>
                  {claim.claimant?.email && (
                    <p className="text-xs text-gray-500">{claim.claimant.email}</p>
                  )}
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                    claim.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : claim.status === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {claim.status}
                </span>
              </div>

              <div className="mb-5 rounded-lg bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                  Claim Reason / Verification Details:
                </p>
                <p className="text-gray-700 whitespace-pre-wrap">{claim.message}</p>
              </div>

              {claim.status === "pending" && (
                <div className="flex gap-3">
                  <button
                    onClick={() => updateClaim(claim._id, "approved")}
                    disabled={updatingClaimId === claim._id}
                    className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    {updatingClaimId === claim._id ? "Processing..." : "Approve"}
                  </button>

                  <button
                    onClick={() => updateClaim(claim._id, "rejected")}
                    disabled={updatingClaimId === claim._id}
                    className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    {updatingClaimId === claim._id ? "Processing..." : "Reject"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Claims;