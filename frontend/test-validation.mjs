import assert from "node:assert";
import {
  isValidEmail,
  isFutureDate,
  validateImageFile,
  formatApiErrorMessage,
  CATEGORIES,
  LOCATIONS,
  ITEM_TYPES,
} from "./src/utils/validation.js";

console.log("=== Testing Validation Utilities ===");

// 1. Email validation tests
assert.strictEqual(isValidEmail(""), false, "Empty email should be invalid");
assert.strictEqual(isValidEmail("plainaddress"), false, "Plain string should be invalid email");
assert.strictEqual(isValidEmail("@missingusername.com"), false, "Missing user should be invalid");
assert.strictEqual(isValidEmail("user@.com"), false, "Missing domain should be invalid");
assert.strictEqual(isValidEmail("user@domain"), false, "Missing TLD should be invalid");
assert.strictEqual(isValidEmail("test@example.com"), true, "Valid email should pass");
assert.strictEqual(isValidEmail("student.123@campus.edu"), true, "Valid student email should pass");
console.log("✔ Email validation tests passed");

// 2. Future date tests
const pastDate = new Date(Date.now() - 86400000 * 2).toISOString().split("T")[0];
const todayDate = new Date().toISOString().split("T")[0];
const futureDate = new Date(Date.now() + 86400000 * 5).toISOString().split("T")[0];

assert.strictEqual(isFutureDate(pastDate), false, "Past date is not future");
assert.strictEqual(isFutureDate(todayDate), false, "Today is not future");
assert.strictEqual(isFutureDate(futureDate), true, "Future date is detected");
console.log("✔ Date validation tests passed");

// 3. Image validation tests
assert.strictEqual(validateImageFile(null), null, "Null image is allowed (optional)");
assert.strictEqual(
  validateImageFile({ type: "application/pdf", size: 1000 }),
  "Please upload a valid image file (JPEG, PNG, WEBP, or GIF)."
);
assert.strictEqual(
  validateImageFile({ type: "image/png", size: 6 * 1024 * 1024 }),
  "Image file size exceeds 5MB. Please upload a smaller image."
);
assert.strictEqual(validateImageFile({ type: "image/png", size: 1024 }), null, "Valid image passes");
console.log("✔ Image validation tests passed");

// 4. API Error message formatting tests
// Network error
assert.strictEqual(
  formatApiErrorMessage({ code: "ERR_NETWORK" }),
  "Unable to connect to the server. Please check your network connection and try again."
);
assert.strictEqual(
  formatApiErrorMessage({ message: "Network Error" }),
  "Unable to connect to the server. Please check your network connection and try again."
);

// Known server messages
assert.strictEqual(
  formatApiErrorMessage({ response: { status: 400, data: { message: "User already exists" } } }),
  "An account with this email address already exists. Please log in instead."
);
assert.strictEqual(
  formatApiErrorMessage({ response: { status: 401, data: { message: "Invalid email or password" } } }),
  "Incorrect email or password. Please verify your credentials and try again."
);
assert.strictEqual(
  formatApiErrorMessage({ response: { status: 400, data: { message: "You cannot claim your own item" } } }),
  "You cannot submit a claim for an item you reported."
);
assert.strictEqual(
  formatApiErrorMessage({ response: { status: 400, data: { message: "You already have a pending claim" } } }),
  "You already have a pending claim for this item. Please wait for the owner to review it."
);
assert.strictEqual(
  formatApiErrorMessage({ response: { status: 404, data: { message: "Item not found" } } }),
  "The requested item could not be found. It may have been removed."
);
assert.strictEqual(
  formatApiErrorMessage({ response: { status: 403, data: { message: "You can only edit your own reports" } } }),
  "You do not have permission to edit this report."
);

// HTTP status fallbacks
assert.strictEqual(
  formatApiErrorMessage({ response: { status: 401, data: {} } }),
  "Incorrect email or password. Please verify your credentials and try again."
);
assert.strictEqual(
  formatApiErrorMessage({ response: { status: 403, data: {} } }),
  "You do not have permission to perform this action."
);
assert.strictEqual(
  formatApiErrorMessage({ response: { status: 500, data: {} } }),
  "A server error occurred. Please try again later."
);

console.log("✔ API Error message formatting tests passed");

// 5. Constants check
assert.strictEqual(ITEM_TYPES.includes("lost"), true);
assert.strictEqual(ITEM_TYPES.includes("found"), true);
assert.strictEqual(CATEGORIES.length >= 8, true);
assert.strictEqual(LOCATIONS.length >= 8, true);
console.log("✔ Constants checks passed");

console.log("\nALL VALIDATION TESTS PASSED SUCCESSFULLY! 🎉");
