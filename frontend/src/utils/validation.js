/**
 * Validation utilities and helper functions for forms across the application.
 */

export const CATEGORIES = [
  "Electronics",
  "Documents",
  "Clothing",
  "Accessories",
  "Books",
  "Keys",
  "Bags",
  "Other",
];

export const LOCATIONS = [
  "Library",
  "Canteen",
  "Hostel",
  "Main Gate",
  "Academic Block",
  "Sports Complex",
  "Parking",
  "Other",
];

export const ITEM_TYPES = ["lost", "found"];

/**
 * Validates whether an email string follows standard email formatting.
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== "string") return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
};

/**
 * Checks if a date string is in the future (relative to today's end-of-day).
 */
export const isFutureDate = (dateString) => {
  if (!dateString) return false;
  const selectedDate = new Date(dateString);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
  return selectedDate.getTime() > endOfToday.getTime();
};

/**
 * Validates uploaded image file type and size.
 */
export const validateImageFile = (file) => {
  if (!file) return null;
  const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!validTypes.includes(file.type) && !file.type.startsWith("image/")) {
    return "Please upload a valid image file (JPEG, PNG, WEBP, or GIF).";
  }
  const maxSizeBytes = 5 * 1024 * 1024; // 5 MB
  if (file.size > maxSizeBytes) {
    return "Image file size exceeds 5MB. Please upload a smaller image.";
  }
  return null;
};

/**
 * Formats API errors and network failures into human-friendly, actionable messages.
 */
export const formatApiErrorMessage = (
  error,
  defaultFallback = "An unexpected error occurred. Please try again."
) => {
  if (!error) return defaultFallback;

  // Network offline / connection refused
  if (error.code === "ERR_NETWORK" || !error.response) {
    return "Unable to connect to the server. Please check your network connection and try again.";
  }

  const status = error.response.status;
  const serverMsg = error.response.data?.message || error.response.data?.error;

  if (typeof serverMsg === "string" && serverMsg.trim()) {
    // Provide user-friendly replacements for common backend messages
    if (serverMsg.includes("User already exists")) {
      return "An account with this email address already exists. Please log in instead.";
    }
    if (serverMsg.includes("Invalid email or password")) {
      return "Incorrect email or password. Please verify your credentials and try again.";
    }
    if (serverMsg.includes("Name, email and password are required")) {
      return "Please enter your name, email address, and password.";
    }
    if (serverMsg.includes("Email and password are required")) {
      return "Please enter both your email address and password.";
    }
    if (serverMsg.includes("Claim message is required")) {
      return "Please provide details explaining why this item belongs to you.";
    }
    if (serverMsg.includes("You cannot claim your own item")) {
      return "You cannot submit a claim for an item you reported.";
    }
    if (serverMsg.includes("You already have a pending claim")) {
      return "You already have a pending claim for this item. Please wait for the owner to review it.";
    }
    if (serverMsg.includes("Item not found")) {
      return "The requested item could not be found. It may have been removed.";
    }
    if (serverMsg.includes("Claim not found")) {
      return "The requested claim could not be found.";
    }
    if (serverMsg.includes("You can only edit your own reports")) {
      return "You do not have permission to edit this report.";
    }
    if (serverMsg.includes("You can only delete your own reports")) {
      return "You do not have permission to delete this report.";
    }
    if (serverMsg.includes("You are not allowed to view these claims")) {
      return "You do not have permission to view claims for this item.";
    }
    if (serverMsg.includes("You cannot manage this claim")) {
      return "You do not have permission to manage this claim.";
    }
    if (serverMsg.includes("All fields required")) {
      return "Please fill in all required fields before submitting.";
    }
    if (serverMsg.toLowerCase().includes("jwt") || serverMsg.toLowerCase().includes("token")) {
      return "Your session has expired. Please log in again.";
    }
    return serverMsg;
  }

  if (status === 401) {
    return "Incorrect email or password. Please verify your credentials and try again.";
  }
  if (status === 403) {
    return "You do not have permission to perform this action.";
  }
  if (status === 404) {
    return "The requested information could not be found.";
  }
  if (status >= 500) {
    return "A server error occurred. Please try again later.";
  }

  return defaultFallback;
};
