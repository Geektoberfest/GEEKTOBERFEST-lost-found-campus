import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../services/api";
import {
  CATEGORIES,
  LOCATIONS,
  ITEM_TYPES,
  isFutureDate,
  validateImageFile,
  formatApiErrorMessage,
} from "../utils/validation";

function EditItem() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [touched, setTouched] = useState({
    title: false,
    description: false,
    type: false,
    category: false,
    location: false,
    date: false,
    image: false,
  });

  const [errors, setErrors] = useState({
    title: "",
    description: "",
    type: "",
    category: "",
    location: "",
    date: "",
    image: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      setInitialLoading(true);
      setLoadError("");
      const response = await api.get(`/items/${id}`);
      setForm(response.data);
      setPreview(response.data.image || "");
    } catch (err) {
      setLoadError(
        formatApiErrorMessage(
          err,
          "Failed to load item details. The item may not exist."
        )
      );
    } finally {
      setInitialLoading(false);
    }
  };

  const validateField = (field, value) => {
    switch (field) {
      case "title": {
        const trimmed = (value || "").trim();
        if (!trimmed) {
          return "Please enter a title for the item.";
        }
        if (trimmed.length < 3) {
          return "Item title must be at least 3 characters long.";
        }
        if (trimmed.length > 100) {
          return "Item title cannot exceed 100 characters.";
        }
        return "";
      }
      case "description": {
        const trimmed = (value || "").trim();
        if (!trimmed) {
          return "Please provide a description of the item.";
        }
        if (trimmed.length < 10) {
          return "Description must be at least 10 characters long to help identify the item.";
        }
        if (trimmed.length > 1000) {
          return "Description cannot exceed 1000 characters.";
        }
        return "";
      }
      case "type": {
        if (!ITEM_TYPES.includes(value)) {
          return "Please select whether the item was lost or found.";
        }
        return "";
      }
      case "category": {
        if (!value) {
          return "Please select a category for the item.";
        }
        if (!CATEGORIES.includes(value)) {
          return "Please select a valid item category.";
        }
        return "";
      }
      case "location": {
        if (!value) {
          return "Please select the campus location.";
        }
        if (!LOCATIONS.includes(value)) {
          return "Please select a valid campus location.";
        }
        return "";
      }
      case "date": {
        if (!value) {
          return "Please select the date when the item was lost or found.";
        }
        if (isFutureDate(value)) {
          return "The date cannot be in the future. Please select today or a previous date.";
        }
        return "";
      }
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value),
      }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({
      ...prev,
      [field]: validateField(field, form[field]),
    }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setTouched((prev) => ({ ...prev, image: true }));

    if (!file) {
      setImageFile(null);
      setPreview(form.image || "");
      setErrors((prev) => ({ ...prev, image: "" }));
      return;
    }

    const imageError = validateImageFile(file);
    if (imageError) {
      setImageFile(null);
      setPreview(form.image || "");
      setErrors((prev) => ({ ...prev, image: imageError }));
      e.target.value = "";
      return;
    }

    setErrors((prev) => ({ ...prev, image: "" }));
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({
      title: true,
      description: true,
      type: true,
      category: true,
      location: true,
      date: true,
      image: true,
    });

    const newErrors = {
      title: validateField("title", form.title),
      description: validateField("description", form.description),
      type: validateField("type", form.type),
      category: validateField("category", form.category),
      location: validateField("location", form.location),
      date: validateField("date", form.date),
      image: imageFile ? validateImageFile(imageFile) || "" : "",
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((msg) => Boolean(msg));
    if (hasErrors) {
      return;
    }

    try {
      setSaving(true);
      setServerError("");

      const data = new FormData();
      data.append("title", (form.title || "").trim());
      data.append("description", (form.description || "").trim());
      data.append("type", form.type);
      data.append("category", form.category);
      data.append("location", form.location);
      data.append("date", form.date);
      if (imageFile) {
        data.append("image", imageFile);
      }

      await api.put(`/items/${id}`, data);

      alert("Item updated successfully");
      navigate(`/items/${id}`);
    } catch (err) {
      const formatted = formatApiErrorMessage(
        err,
        "Failed to update item. Please check the entered information and try again."
      );
      setServerError(formatted);
    } finally {
      setSaving(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-10 text-center text-gray-500">
        Loading item details...
      </div>
    );
  }

  if (loadError || !form) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-10">
        <div
          role="alert"
          className="rounded-lg bg-red-100 p-6 text-center text-red-700 border border-red-200"
        >
          <p className="font-semibold text-lg mb-2">Item Not Found</p>
          <p className="mb-4 text-sm">{loadError || "Unable to load the requested item."}</p>
          <Link
            to="/items"
            className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700"
          >
            Back to Items
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-8 text-3xl font-bold">Edit Report</h1>

      {serverError && (
        <div
          role="alert"
          className="mb-5 rounded-lg bg-red-100 p-4 text-sm font-medium text-red-700 border border-red-200"
        >
          {serverError}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-5 rounded-xl border bg-white p-6 shadow-sm"
      >
        <div>
          <label htmlFor="edit-title" className="mb-2 block font-medium">
            Item Title <span className="text-red-500">*</span>
          </label>
          <input
            id="edit-title"
            name="title"
            type="text"
            value={form.title || ""}
            onChange={handleChange}
            onBlur={() => handleBlur("title")}
            maxLength={100}
            placeholder="e.g., Black Leather Wallet"
            aria-invalid={Boolean(touched.title && errors.title)}
            aria-describedby={touched.title && errors.title ? "edit-title-error" : undefined}
            className={`w-full rounded-lg border p-3 outline-none transition-colors ${
              touched.title && errors.title
                ? "border-red-500 focus:ring-2 focus:ring-red-300"
                : "border-gray-300 focus:ring-2 focus:ring-blue-500"
            }`}
          />
          {touched.title && errors.title && (
            <p
              id="edit-title-error"
              role="alert"
              className="mt-1.5 text-sm font-medium text-red-600"
            >
              {errors.title}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="edit-description" className="mb-2 block font-medium">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="edit-description"
            name="description"
            value={form.description || ""}
            onChange={handleChange}
            onBlur={() => handleBlur("description")}
            rows="5"
            maxLength={1000}
            placeholder="Describe the item in detail..."
            aria-invalid={Boolean(touched.description && errors.description)}
            aria-describedby={touched.description && errors.description ? "edit-description-error" : undefined}
            className={`w-full rounded-lg border p-3 outline-none transition-colors ${
              touched.description && errors.description
                ? "border-red-500 focus:ring-2 focus:ring-red-300"
                : "border-gray-300 focus:ring-2 focus:ring-blue-500"
            }`}
          />
          {touched.description && errors.description && (
            <p
              id="edit-description-error"
              role="alert"
              className="mt-1.5 text-sm font-medium text-red-600"
            >
              {errors.description}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="edit-type" className="mb-2 block font-medium">
            Type <span className="text-red-500">*</span>
          </label>
          <select
            id="edit-type"
            name="type"
            value={form.type || "lost"}
            onChange={handleChange}
            onBlur={() => handleBlur("type")}
            aria-invalid={Boolean(touched.type && errors.type)}
            aria-describedby={touched.type && errors.type ? "edit-type-error" : undefined}
            className={`w-full rounded-lg border p-3 outline-none transition-colors ${
              touched.type && errors.type
                ? "border-red-500 focus:ring-2 focus:ring-red-300"
                : "border-gray-300 focus:ring-2 focus:ring-blue-500"
            }`}
          >
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
          {touched.type && errors.type && (
            <p
              id="edit-type-error"
              role="alert"
              className="mt-1.5 text-sm font-medium text-red-600"
            >
              {errors.type}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="edit-category" className="mb-2 block font-medium">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="edit-category"
            name="category"
            value={form.category || ""}
            onChange={handleChange}
            onBlur={() => handleBlur("category")}
            aria-invalid={Boolean(touched.category && errors.category)}
            aria-describedby={touched.category && errors.category ? "edit-category-error" : undefined}
            className={`w-full rounded-lg border p-3 outline-none transition-colors ${
              touched.category && errors.category
                ? "border-red-500 focus:ring-2 focus:ring-red-300"
                : "border-gray-300 focus:ring-2 focus:ring-blue-500"
            }`}
          >
            <option value="">Select Category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {touched.category && errors.category && (
            <p
              id="edit-category-error"
              role="alert"
              className="mt-1.5 text-sm font-medium text-red-600"
            >
              {errors.category}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="edit-location" className="mb-2 block font-medium">
            Location <span className="text-red-500">*</span>
          </label>
          <select
            id="edit-location"
            name="location"
            value={form.location || ""}
            onChange={handleChange}
            onBlur={() => handleBlur("location")}
            aria-invalid={Boolean(touched.location && errors.location)}
            aria-describedby={touched.location && errors.location ? "edit-location-error" : undefined}
            className={`w-full rounded-lg border p-3 outline-none transition-colors ${
              touched.location && errors.location
                ? "border-red-500 focus:ring-2 focus:ring-red-300"
                : "border-gray-300 focus:ring-2 focus:ring-blue-500"
            }`}
          >
            <option value="">Select Location</option>
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          {touched.location && errors.location && (
            <p
              id="edit-location-error"
              role="alert"
              className="mt-1.5 text-sm font-medium text-red-600"
            >
              {errors.location}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="edit-date" className="mb-2 block font-medium">
            Lost / Found Date <span className="text-red-500">*</span>
          </label>
          <input
            id="edit-date"
            type="date"
            name="date"
            value={form.date ? form.date.slice(0, 10) : ""}
            onChange={handleChange}
            onBlur={() => handleBlur("date")}
            max={new Date().toISOString().split("T")[0]}
            aria-invalid={Boolean(touched.date && errors.date)}
            aria-describedby={touched.date && errors.date ? "edit-date-error" : undefined}
            className={`w-full rounded-lg border p-3 outline-none transition-colors ${
              touched.date && errors.date
                ? "border-red-500 focus:ring-2 focus:ring-red-300"
                : "border-gray-300 focus:ring-2 focus:ring-blue-500"
            }`}
          />
          {touched.date && errors.date && (
            <p
              id="edit-date-error"
              role="alert"
              className="mt-1.5 text-sm font-medium text-red-600"
            >
              {errors.date}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="edit-image" className="mb-2 block font-medium">
            Change Image (optional)
          </label>
          <input
            id="edit-image"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleImage}
            aria-invalid={Boolean(touched.image && errors.image)}
            aria-describedby={touched.image && errors.image ? "edit-image-error" : undefined}
            className={`w-full rounded-lg border p-3 outline-none transition-colors ${
              touched.image && errors.image
                ? "border-red-500 focus:ring-2 focus:ring-red-300"
                : "border-gray-300 focus:ring-2 focus:ring-blue-500"
            }`}
          />
          <p className="mt-1 text-xs text-gray-500">
            Accepted formats: JPEG, PNG, WEBP, GIF. Maximum size: 5MB.
          </p>
          {touched.image && errors.image && (
            <p
              id="edit-image-error"
              role="alert"
              className="mt-1.5 text-sm font-medium text-red-600"
            >
              {errors.image}
            </p>
          )}
          {preview && (
            <div className="mt-3">
              <img
                src={preview}
                alt="Item Preview"
                className="h-40 rounded-lg object-cover border"
              />
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 rounded-lg bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving Changes..." : "Save Changes"}
          </button>
          <Link
            to={`/items/${id}`}
            className="rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default EditItem;